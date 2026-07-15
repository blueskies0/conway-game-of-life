import { useState } from 'react';
import { Shuffle, Grid3X3, CircleDot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AttractionMatrix } from '@/types/particle';
import { PARTICLE_TYPE_CONFIGS, PARTICLE_TYPE_COUNT, generateRandomMatrix, generateBalancedMatrix, generateClusterMatrix } from '@/types/particle';

interface MatrixEditorProps {
  matrix: AttractionMatrix;
  onMatrixChange: (matrix: AttractionMatrix) => void;
  onCellChange: (row: number, col: number, value: number) => void;
}

export function MatrixEditor({ matrix, onMatrixChange, onCellChange }: MatrixEditorProps) {
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);

  const handleRandomMatrix = () => {
    onMatrixChange(generateRandomMatrix());
  };

  const handleBalancedMatrix = () => {
    onMatrixChange(generateBalancedMatrix());
  };

  const handleClusterMatrix = () => {
    onMatrixChange(generateClusterMatrix());
  };

  const getCellColor = (value: number): string => {
    if (value > 0.3) return 'bg-emerald-500/80';
    if (value > 0) return 'bg-emerald-400/50';
    if (value < -0.3) return 'bg-rose-500/80';
    if (value < 0) return 'bg-rose-400/50';
    return 'bg-slate-600/50';
  };

  const getCellIntensity = (value: number): number => {
    return Math.min(Math.abs(value) * 200 + 30, 100);
  };

  return (
    <Card className="w-full max-w-md bg-slate-900/90 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-slate-100">
          <Grid3X3 className="w-5 h-5" />
          引力矩阵
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 预设按钮 */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRandomMatrix}
            className="flex-1 bg-slate-800 border-slate-600 hover:bg-slate-700 text-slate-200"
          >
            <Shuffle className="w-4 h-4 mr-1" />
            随机
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleBalancedMatrix}
            className="flex-1 bg-slate-800 border-slate-600 hover:bg-slate-700 text-slate-200"
          >
            <CircleDot className="w-4 h-4 mr-1" />
            平衡
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClusterMatrix}
            className="flex-1 bg-slate-800 border-slate-600 hover:bg-slate-700 text-slate-200"
          >
            <Grid3X3 className="w-4 h-4 mr-1" />
            聚类
          </Button>
        </div>

        {/* 矩阵可视化 */}
        <div className="space-y-2">
          <div className="text-sm text-slate-400">点击单元格调节引力/斥力</div>
          
          {/* 列标签 */}
          <div className="flex gap-1">
            <div className="w-8" />
            {PARTICLE_TYPE_CONFIGS.map((config, i) => (
              <div
                key={i}
                className="w-8 h-8 flex items-center justify-center text-xs font-bold rounded"
                style={{ backgroundColor: config.color + '40', color: config.color }}
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* 矩阵网格 */}
          <div className="space-y-1">
            {matrix.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1">
                {/* 行标签 */}
                <div
                  className="w-8 h-8 flex items-center justify-center text-xs font-bold rounded"
                  style={{ 
                    backgroundColor: PARTICLE_TYPE_CONFIGS[rowIndex].color + '40',
                    color: PARTICLE_TYPE_CONFIGS[rowIndex].color 
                  }}
                >
                  {rowIndex + 1}
                </div>
                
                {/* 单元格 */}
                {row.map((value, colIndex) => (
                  <button
                    key={colIndex}
                    onClick={() => {
                      if (editingCell?.row === rowIndex && editingCell?.col === colIndex) {
                        setEditingCell(null);
                      } else {
                        setEditingCell({ row: rowIndex, col: colIndex });
                      }
                    }}
                    className={`w-8 h-8 rounded transition-all duration-200 hover:scale-110 ${getCellColor(value)}`}
                    style={{ opacity: getCellIntensity(value) / 100 }}
                    title={`类型 ${rowIndex + 1} → 类型 ${colIndex + 1}: ${value.toFixed(2)}`}
                  >
                    <span className="text-[8px] text-white/80">
                      {value > 0 ? '+' : value < 0 ? '-' : '0'}
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* 图例 */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-rose-500/80" />
              <span>排斥</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-slate-600/50" />
              <span>中性</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500/80" />
              <span>吸引</span>
            </div>
          </div>
        </div>

        {/* 编辑面板 */}
        {editingCell && (
          <div className="p-3 bg-slate-800 rounded-lg space-y-2">
            <div className="text-sm text-slate-300">
              编辑: 类型 {editingCell.row + 1} → 类型 {editingCell.col + 1}
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={matrix[editingCell.row][editingCell.col] * 100}
              onChange={(e) => {
                const value = parseInt(e.target.value) / 100;
                onCellChange(editingCell.row, editingCell.col, value);
              }}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>-1.0 (排斥)</span>
              <span className="text-slate-200 font-mono">
                {matrix[editingCell.row][editingCell.col].toFixed(2)}
              </span>
              <span>+1.0 (吸引)</span>
            </div>
          </div>
        )}

        {/* 粒子类型说明 */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          {PARTICLE_TYPE_CONFIGS.map((config, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-2 bg-slate-800/50 rounded"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <span className="text-xs text-slate-300">{config.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
