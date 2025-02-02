export const getBeltColor = (beltRank: string): string => {
  const colors: Record<string, string> = {
    'White': 'bg-white border border-gray-300',
    'Yellow': 'bg-yellow-200',
    'Orange': 'bg-orange-300',
    'Green': 'bg-green-500 text-white',
    'Blue': 'bg-blue-500 text-white',
    'Purple': 'bg-purple-500 text-white',
    'Brown 3': 'bg-amber-700 text-white',
    'Brown 2': 'bg-amber-700 text-white',
    'Brown 1': 'bg-amber-700 text-white',
    'Black 1': 'bg-gray-900 text-white',
    'Black 2': 'bg-gray-900 text-white',
    'Black 3': 'bg-gray-900 text-white'
  };

  return colors[beltRank] || 'bg-gray-100';
};