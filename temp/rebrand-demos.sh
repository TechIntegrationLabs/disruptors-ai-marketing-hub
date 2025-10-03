#!/bin/bash

# Rebrand all demo pages with Disruptors AI color scheme
# Gold (#FFD700), Black (#0E0E0E), White, Cream (#EAEAEA)

# Color replacements
find src/pages/demos -name "*.jsx" -type f -exec sed -i '' \
  -e 's/text-yellow-500/text-[#FFD700]/g' \
  -e 's/text-yellow-400/text-[#FFD700]/g' \
  -e 's/bg-yellow-500/bg-[#FFD700]/g' \
  -e 's/bg-yellow-400/bg-[#E0B200]/g' \
  -e 's/hover:bg-yellow-500/hover:bg-[#FFD700]/g' \
  -e 's/hover:bg-yellow-400/hover:bg-[#E0B200]/g' \
  -e 's/border-yellow-500/border-[#FFD700]/g' \
  -e 's/shadow-yellow-500/shadow-[#FFD700]/g' \
  -e 's/from-yellow-500/from-[#FFD700]/g' \
  -e 's/to-yellow-500/to-[#FFD700]/g' \
  -e 's/bg-gray-900/bg-[#0E0E0E]/g' \
  -e 's/bg-gray-800/bg-[#1A1A1A]/g' \
  -e 's/text-gray-300/text-[#EAEAEA]/g' \
  -e 's/text-gray-400/text-[#C7C7C7]/g' \
  -e 's/border-gray-800/border-[#2A2A2A]/g' \
  -e 's/border-gray-700/border-[#2A2A2A]/g' \
  -e 's/bg-black/bg-[#0E0E0E]/g' \
  {} +

# Remove bright colors (red, green, blue, purple, etc.) - replace with gold or neutrals
find src/pages/demos -name "*.jsx" -type f -exec sed -i '' \
  -e 's/text-red-500/text-[#FFD700]/g' \
  -e 's/text-red-600/text-[#FFD700]/g' \
  -e 's/bg-red-500/bg-[#FFD700]/g' \
  -e 's/bg-red-600/bg-[#FFD700]/g' \
  -e 's/bg-red-700/bg-[#0E0E0E]/g' \
  -e 's/border-red-500/border-[#FFD700]/g' \
  -e 's/border-red-300/border-[#2A2A2A]/g' \
  -e 's/text-green-500/text-[#FFD700]/g' \
  -e 's/text-green-600/text-[#FFD700]/g' \
  -e 's/text-green-400/text-[#FFD700]/g' \
  -e 's/bg-green-500/bg-[#FFD700]/g' \
  -e 's/bg-green-600/bg-[#E0B200]/g' \
  -e 's/from-green-500/from-[#FFD700]/g' \
  -e 's/to-green-600/to-[#E0B200]/g' \
  -e 's/border-green-500/border-[#FFD700]/g' \
  -e 's/text-blue-500/text-[#FFD700]/g' \
  -e 's/text-blue-600/text-[#FFD700]/g' \
  -e 's/bg-blue-500/bg-[#FFD700]/g' \
  -e 's/bg-blue-600/bg-[#E0B200]/g' \
  -e 's/from-blue-500/from-[#FFD700]/g' \
  -e 's/to-purple-500/to-[#E0B200]/g' \
  -e 's/to-purple-600/to-[#E0B200]/g' \
  -e 's/text-purple-500/text-[#FFD700]/g' \
  -e 's/bg-purple-500/bg-[#FFD700]/g' \
  {} +

echo "✓ All demo pages rebranded with Disruptors AI colors"
