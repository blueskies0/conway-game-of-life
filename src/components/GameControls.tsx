import { Play, Pause, StepForward, Trash2, Shuffle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { GameParams } from '@/types/gameOfLife';

interface GameControlsProps {
  isRunning: boolean;
  generation: number;
  population: number;
  params: GameParams;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onClear: () => void;
  onRandomize: () => void;
  onParamsChange: (params: Partial<GameParams>) => void;
}

export function GameControls({
  isRunning,
  generation,
  population,
  params,
  onPlay,
  onPause,
  onStep,
  onClear,
  onRandomize,
  onParamsChange,
}: GameControlsProps) {
  return (
    <div className="space-y-6">
      {/* 统计信息 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
          <div className="text-xs text-slate-500 mb-1">代数</div>
          <div className="text-2xl font-mono text-emerald-400">{generation.toLocaleString()}</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
          <div className="text-xs text-slate-500 mb-1">人口</div>
          <div className="text-2xl font-mono text-cyan-400">{population.toLocaleString()}</div>
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex flex-wrap gap-2">
        {isRunning ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onPause}
            className="flex-1 bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
          >
            <Pause className="w-4 h-4 mr-2" />
            暂停
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={onPlay}
            className="flex-1 bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
          >
            <Play className="w-4 h-4 mr-2" />
            播放
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onStep}
          disabled={isRunning}
          className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
        >
          <StepForward className="w-4 h-4 mr-2" />
          单步
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onRandomize}
          className="bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          随机
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          清空
        </Button>
      </div>

      {/* 速度控制 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-slate-400 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            演化速度
          </Label>
          <span className="text-xs text-slate-500 font-mono">{params.speed}ms</span>
        </div>
        <Slider
          value={[params.speed]}
          onValueChange={([value]) => onParamsChange({ speed: value })}
          min={10}
          max={1000}
          step={10}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-slate-600">
          <span>快</span>
          <span>慢</span>
        </div>
      </div>

      {/* 视觉效果 */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-slate-400">发光效果</Label>
          <Switch
            checked={params.glowIntensity > 0}
            onCheckedChange={(checked) =>
              onParamsChange({ glowIntensity: checked ? 0.8 : 0 })
            }
          />
        </div>

        {params.glowIntensity > 0 && (
          <div className="space-y-2">
            <Label className="text-xs text-slate-500">发光强度</Label>
            <Slider
              value={[params.glowIntensity * 100]}
              onValueChange={([value]) =>
                onParamsChange({ glowIntensity: value / 100 })
              }
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <Label className="text-sm text-slate-400">显示轨迹</Label>
          <Switch
            checked={params.showTrails}
            onCheckedChange={(checked) =>
              onParamsChange({ showTrails: checked })
            }
          />
        </div>

        {params.showTrails && (
          <div className="space-y-2">
            <Label className="text-xs text-slate-500">轨迹长度</Label>
            <Slider
              value={[params.trailLength]}
              onValueChange={([value]) =>
                onParamsChange({ trailLength: value })
              }
              min={1}
              max={20}
              step={1}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* 细胞大小 */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-slate-400">细胞大小</Label>
          <span className="text-xs text-slate-500 font-mono">{params.cellSize}px</span>
        </div>
        <Slider
          value={[params.cellSize]}
          onValueChange={([value]) => onParamsChange({ cellSize: value })}
          min={4}
          max={20}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  );
}
