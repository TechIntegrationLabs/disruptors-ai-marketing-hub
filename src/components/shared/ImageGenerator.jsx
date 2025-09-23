import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Download, Copy, Share2, Wand2, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ImageGenerationService from '@/lib/image-generation';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('gemini');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [options, setOptions] = useState({
    size: '1024x1024',
    quality: 'standard',
    count: 1,
    model: 'gemini-2.5-flash-image'
  });

  const { toast } = useToast();
  const imageService = new ImageGenerationService();

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt for image generation",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      let result;

      switch (selectedProvider) {
        case 'gemini':
          result = await imageService.generateWithGemini(prompt, options);
          break;
        case 'openai':
          result = await imageService.generateWithOpenAI(prompt, options);
          break;
        case 'replicate':
          result = await imageService.generateWithReplicate(prompt, options);
          break;
        case 'all':
          const allResults = await imageService.generateWithAllProviders(prompt, {
            gemini: options,
            openai: options,
            replicate: options
          });
          setGeneratedImages(prev => [...allResults.filter(r => r.success).map(r => r.data), ...prev]);
          toast({
            title: "Success",
            description: `Generated images with ${allResults.filter(r => r.success).length} provider(s)`
          });
          return;
        default:
          throw new Error('Invalid provider selected');
      }

      setGeneratedImages(prev => [result, ...prev]);

      toast({
        title: "Success",
        description: `Image generated successfully with ${result.provider}`
      });

    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate image",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, selectedProvider, options, toast]);

  const handleDownload = useCallback(async (imageUrl, filename) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `generated-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Downloaded",
        description: "Image downloaded successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download image",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleCopyUrl = useCallback((imageUrl) => {
    navigator.clipboard.writeText(imageUrl);
    toast({
      title: "Copied",
      description: "Image URL copied to clipboard"
    });
  }, [toast]);

  const models = imageService.getAvailableModels();

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">AI Image Generator</h1>
        <p className="text-muted-foreground">Generate stunning images using Google Gemini, OpenAI, and Replicate</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Image Generation
          </CardTitle>
          <CardDescription>
            Enter a prompt and select your preferred AI model to generate images
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Prompt</label>
            <Textarea
              placeholder="Describe the image you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Provider</label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini">Google Gemini (nano-banana)</SelectItem>
                  <SelectItem value="openai">OpenAI GPT-image-1</SelectItem>
                  <SelectItem value="replicate">Replicate</SelectItem>
                  <SelectItem value="all">All Providers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Image Size</label>
              <Select value={options.size} onValueChange={(value) => setOptions(prev => ({ ...prev, size: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="512x512">512×512</SelectItem>
                  <SelectItem value="1024x1024">1024×1024</SelectItem>
                  <SelectItem value="1536x1536">1536×1536</SelectItem>
                  <SelectItem value="2048x2048">2048×2048</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 h-4 w-4" />
                Generate Image
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Images</CardTitle>
            <CardDescription>
              Your generated images appear here. Click to download or copy the URL.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedImages.map((image, index) => (
                <div key={index} className="space-y-3">
                  <div className="relative group">
                    <img
                      src={image.imageUrl}
                      alt={`Generated image ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg border"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/400/400';
                        e.target.alt = 'Failed to load image';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleDownload(image.imageUrl, `${image.provider}-${index + 1}.png`)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleCopyUrl(image.imageUrl)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigator.share?.({ url: image.imageUrl })}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="capitalize">
                        {image.provider}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(image.metadata.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate" title={image.metadata.prompt}>
                      "{image.metadata.prompt}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Available Models</CardTitle>
          <CardDescription>
            Learn about the different AI models available for image generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="gemini" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="gemini">Google Gemini</TabsTrigger>
              <TabsTrigger value="openai">OpenAI</TabsTrigger>
              <TabsTrigger value="replicate">Replicate</TabsTrigger>
            </TabsList>

            <TabsContent value="gemini" className="space-y-3">
              {models.gemini.map((model) => (
                <div key={model.id} className="p-4 border rounded-lg">
                  <h4 className="font-semibold">{model.name}</h4>
                  <p className="text-sm text-muted-foreground">{model.description}</p>
                  <Badge variant="secondary" className="mt-2">nano-banana</Badge>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="openai" className="space-y-3">
              {models.openai.map((model) => (
                <div key={model.id} className="p-4 border rounded-lg">
                  <h4 className="font-semibold">{model.name}</h4>
                  <p className="text-sm text-muted-foreground">{model.description}</p>
                  <Badge variant="secondary" className="mt-2">High Resolution</Badge>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="replicate" className="space-y-3">
              {models.replicate.map((model) => (
                <div key={model.id} className="p-4 border rounded-lg">
                  <h4 className="font-semibold">{model.name}</h4>
                  <p className="text-sm text-muted-foreground">{model.description}</p>
                  <Badge variant="secondary" className="mt-2">Open Source</Badge>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageGenerator;