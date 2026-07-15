import { useState, useMemo } from 'react';
import { Search, Grid3X3, Zap, Rocket, Target, UtensilsCrossed, Wind, Skull } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import type { Pattern, PatternCategory } from '@/types/gameOfLife';
import { CATEGORY_NAMES, CATEGORY_ICONS } from '@/types/gameOfLife';
import { allPatterns, searchPatterns, getPatternsByCategory } from '@/data/patterns';

interface PatternBrowserProps {
  onSelectPattern: (pattern: Pattern) => void;
}

const categories: PatternCategory[] = [
  'still-life',
  'oscillator',
  'spaceship',
  'gun',
  'eater',
  'puffer',
  'methuselah',
];

const categoryIcons: Record<PatternCategory, React.ReactNode> = {
  'still-life': <Grid3X3 className="w-4 h-4" />,
  'oscillator': <Zap className="w-4 h-4" />,
  'spaceship': <Rocket className="w-4 h-4" />,
  'gun': <Target className="w-4 h-4" />,
  'eater': <UtensilsCrossed className="w-4 h-4" />,
  'puffer': <Wind className="w-4 h-4" />,
  'methuselah': <Skull className="w-4 h-4" />,
  'breeder': <Rocket className="w-4 h-4" />,
  'sawtooth': <Zap className="w-4 h-4" />,
  'wick': <Wind className="w-4 h-4" />,
  'fuse': <Wind className="w-4 h-4" />,
  'converter': <Zap className="w-4 h-4" />,
  'reflector': <Target className="w-4 h-4" />,
  'other': <Grid3X3 className="w-4 h-4" />,
};

export function PatternBrowser({ onSelectPattern }: PatternBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PatternCategory | 'all'>('all');

  const filteredPatterns = useMemo(() => {
    let patterns = allPatterns;

    if (selectedCategory !== 'all') {
      patterns = getPatternsByCategory(selectedCategory);
    }

    if (searchQuery.trim()) {
      patterns = searchPatterns(searchQuery).filter(p =>
        selectedCategory === 'all' || p.category === selectedCategory
      );
    }

    return patterns;
  }, [searchQuery, selectedCategory]);

  const patternsByCategory = useMemo(() => {
    const grouped: Record<string, Pattern[]> = {};
    filteredPatterns.forEach(pattern => {
      if (!grouped[pattern.category]) {
        grouped[pattern.category] = [];
      }
      grouped[pattern.category].push(pattern);
    });
    return grouped;
  }, [filteredPatterns]);

  return (
    <div className="space-y-4">
      {/* 搜索框 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="搜索模板..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-600"
        />
      </div>

      {/* 类别筛选 */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('all')}
          className={selectedCategory === 'all'
            ? 'bg-emerald-500 hover:bg-emerald-600'
            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
          }
        >
          全部
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category
              ? 'bg-emerald-500 hover:bg-emerald-600'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }
          >
            {categoryIcons[category]}
            <span className="ml-1">{CATEGORY_NAMES[category]}</span>
          </Button>
        ))}
      </div>

      {/* 模板列表 */}
      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {Object.entries(patternsByCategory).map(([category, patterns]) => (
            <div key={category}>
              <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                {categoryIcons[category as PatternCategory]}
                {CATEGORY_NAMES[category as PatternCategory]}
                <Badge variant="secondary" className="bg-slate-800 text-slate-400">
                  {patterns.length}
                </Badge>
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {patterns.map((pattern) => (
                  <Button
                    key={pattern.id}
                    variant="outline"
                    onClick={() => onSelectPattern(pattern)}
                    className="justify-start h-auto py-3 px-4 bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-200 font-medium truncate">
                          {pattern.name}
                        </span>
                        {pattern.period && (
                          <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-400">
                            周期 {pattern.period}
                          </Badge>
                        )}
                        {pattern.speed && (
                          <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">
                            {pattern.speed}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 truncate">
                        {pattern.description}
                      </p>
                      {pattern.author && (
                        <p className="text-xs text-slate-600 mt-0.5">
                          by {pattern.author}{pattern.year && ` (${pattern.year})`}
                        </p>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          ))}

          {filteredPatterns.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>未找到匹配的模板</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* 统计 */}
      <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        共 {allPatterns.length} 个模板
      </div>
    </div>
  );
}
