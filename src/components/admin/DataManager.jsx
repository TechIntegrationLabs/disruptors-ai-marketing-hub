import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Users,
  Briefcase,
  BookOpen,
  MessageSquare,
  Mail,
  Target,
  Settings,
  Image,
  Database,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Shield
} from 'lucide-react';
import SpreadsheetEditor from './SpreadsheetEditor';
import { TABLE_SCHEMAS, getPriorityTables, getTableSchema } from './TableSchemaManager';
import { customClient } from '@/lib/custom-sdk';

/**
 * Map table name to entity name for custom SDK
 */
const getEntityName = (tableName) => {
  const entityMap = {
    'posts': 'Post',
    'team_members': 'TeamMember',
    'services': 'Service',
    'case_studies': 'CaseStudy',
    'testimonials': 'Testimonial',
    'contact_submissions': 'ContactSubmission',
    'leads': 'Lead',
    'lead_interactions': 'LeadInteraction',
    'settings': 'Setting',
    'media': 'Media',
    'profiles': 'Profile',
    'page_views': 'PageView'
  };
  return entityMap[tableName] || tableName.charAt(0).toUpperCase() + tableName.slice(1, -1);
};

/**
 * Icon mapping for table types
 */
const ICON_MAP = {
  FileText,
  Users,
  Briefcase,
  BookOpen,
  MessageSquare,
  Mail,
  Target,
  Settings,
  Image
};

/**
 * DataManager Component
 * Main interface for managing all Supabase tables
 */
const DataManager = () => {
  const [activeTable, setActiveTable] = useState('posts');
  const [tableData, setTableData] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const [stats, setStats] = useState({});

  const priorityTables = getPriorityTables();

  /**
   * Load data for a specific table
   */
  const loadTableData = async (tableName) => {
    setLoading(prev => ({ ...prev, [tableName]: true }));
    setErrors(prev => ({ ...prev, [tableName]: null }));

    try {
      // Use custom SDK to get entity
      const entityName = getEntityName(tableName);
      const entity = customClient.entities[entityName];

      const data = await entity.list('-created_at', 1000);

      setTableData(prev => ({ ...prev, [tableName]: data }));
      setStats(prev => ({ ...prev, [tableName]: { count: data.length, loaded: true } }));
    } catch (error) {
      console.error(`Error loading ${tableName}:`, error);
      setErrors(prev => ({
        ...prev,
        [tableName]: error.message || `Failed to load ${tableName}`
      }));
    } finally {
      setLoading(prev => ({ ...prev, [tableName]: false }));
    }
  };

  /**
   * Update a row in a table
   */
  const handleUpdate = async (tableName, rowId, updates) => {
    try {
      const entityName = getEntityName(tableName);
      const entity = customClient.entities[entityName];

      await entity.update(rowId, updates);

      // Reload data to reflect changes
      await loadTableData(tableName);

      return { success: true };
    } catch (error) {
      console.error(`Error updating ${tableName}:`, error);
      setErrors(prev => ({
        ...prev,
        [tableName]: error.message || `Failed to update record`
      }));
      return { success: false, error: error.message };
    }
  };

  /**
   * Create a new row in a table
   */
  const handleCreate = async (tableName, data) => {
    try {
      const entityName = getEntityName(tableName);
      const entity = customClient.entities[entityName];

      await entity.create(data);

      // Reload data to show new record
      await loadTableData(tableName);

      return { success: true };
    } catch (error) {
      console.error(`Error creating in ${tableName}:`, error);
      setErrors(prev => ({
        ...prev,
        [tableName]: error.message || `Failed to create record`
      }));
      return { success: false, error: error.message };
    }
  };

  /**
   * Delete a row from a table
   */
  const handleDelete = async (tableName, rowId) => {
    try {
      const entityName = getEntityName(tableName);
      const entity = customClient.entities[entityName];

      await entity.delete(rowId);

      // Remove from local state immediately
      setTableData(prev => ({
        ...prev,
        [tableName]: prev[tableName]?.filter(row => row.id !== rowId) || []
      }));

      return { success: true };
    } catch (error) {
      console.error(`Error deleting from ${tableName}:`, error);
      setErrors(prev => ({
        ...prev,
        [tableName]: error.message || `Failed to delete record`
      }));
      return { success: false, error: error.message };
    }
  };

  /**
   * Load data when active table changes
   */
  useEffect(() => {
    if (activeTable && !tableData[activeTable]) {
      loadTableData(activeTable);
    }
  }, [activeTable]);

  /**
   * Initial load of first table
   */
  useEffect(() => {
    loadTableData('posts');
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-green-400 font-mono">DATA MANAGER</h2>
          <p className="text-green-400/60 text-sm mt-1">
            Direct access to all Supabase database tables
          </p>
        </div>
        <Button
          onClick={() => loadTableData(activeTable)}
          variant="outline"
          size="sm"
          className="border-green-400 text-green-400 hover:bg-green-400/20"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {priorityTables.map(tableName => {
          const schema = getTableSchema(tableName);
          const Icon = ICON_MAP[schema?.icon] || Database;
          const stat = stats[tableName];

          return (
            <Card
              key={tableName}
              className={`bg-black/50 border-green-400/30 cursor-pointer transition-all ${
                activeTable === tableName ? 'ring-2 ring-green-400' : 'hover:border-green-400/60'
              }`}
              onClick={() => setActiveTable(tableName)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-green-400/80">{schema?.displayName}</span>
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {stat?.count !== undefined ? stat.count : '—'}
                </div>
                {stat?.loaded && (
                  <CheckCircle className="w-3 h-3 text-green-400 mt-1" />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Table Tabs */}
      <Tabs value={activeTable} onValueChange={setActiveTable} className="w-full">
        <TabsList className="bg-black/50 border border-green-400/30 flex-wrap h-auto p-2">
          {priorityTables.map(tableName => {
            const schema = getTableSchema(tableName);
            const Icon = ICON_MAP[schema?.icon] || Database;

            return (
              <TabsTrigger
                key={tableName}
                value={tableName}
                className="data-[state=active]:bg-green-400/20 data-[state=active]:text-green-400 text-green-400/60"
              >
                <Icon className="w-4 h-4 mr-2" />
                {schema?.displayName}
                {stats[tableName]?.count !== undefined && (
                  <Badge variant="outline" className="ml-2 text-xs border-green-400/50 text-green-400">
                    {stats[tableName].count}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {priorityTables.map(tableName => {
          const schema = getTableSchema(tableName);

          return (
            <TabsContent key={tableName} value={tableName} className="mt-6">
              <Card className="bg-black/50 border-green-400/30">
                <CardHeader>
                  <CardTitle className="text-green-400 font-mono flex items-center">
                    {ICON_MAP[schema?.icon] &&
                      React.createElement(ICON_MAP[schema.icon], { className: "w-5 h-5 mr-2" })
                    }
                    {schema?.displayName}
                  </CardTitle>
                  <CardDescription className="text-green-400/60">
                    {schema?.description}
                  </CardDescription>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      <Shield className="w-3 h-3 mr-1" />
                      RLS Enabled
                    </Badge>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      <Database className="w-3 h-3 mr-1" />
                      {schema?.columns?.length || 0} columns
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {errors[tableName] && (
                    <div className="mb-4 bg-red-900/20 border border-red-400 rounded-lg p-4 flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-red-400 font-semibold">Error loading data</div>
                        <div className="text-red-400/80 text-sm mt-1">{errors[tableName]}</div>
                        <Button
                          onClick={() => loadTableData(tableName)}
                          variant="outline"
                          size="sm"
                          className="mt-2 border-red-400 text-red-400 hover:bg-red-400/20"
                        >
                          <RefreshCw className="w-3 h-3 mr-2" />
                          Retry
                        </Button>
                      </div>
                    </div>
                  )}

                  <SpreadsheetEditor
                    tableName={tableName}
                    columns={schema?.columns || []}
                    data={tableData[tableName] || []}
                    onUpdate={(rowId, updates) => handleUpdate(tableName, rowId, updates)}
                    onCreate={(data) => handleCreate(tableName, data)}
                    onDelete={(rowId) => handleDelete(tableName, rowId)}
                    isLoading={loading[tableName]}
                    error={errors[tableName]}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Help Text */}
      <Card className="bg-black/50 border-green-400/30">
        <CardContent className="p-4">
          <div className="flex items-start space-x-2 text-sm text-green-400/60">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-green-400">Usage Tips:</strong> Click any cell to edit inline.
              Changes are saved immediately to Supabase. Use column visibility toggle to show/hide fields.
              All operations respect Row Level Security (RLS) policies. Read-only fields are marked and cannot be edited.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataManager;
