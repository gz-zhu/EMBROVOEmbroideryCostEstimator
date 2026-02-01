import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Button } from "./components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Separator } from "./components/ui/separator";
import { Badge } from "./components/ui/badge";
import {
  Calculator,
  Zap,
  FileDown,
} from "lucide-react";
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import backgroundImage from './public/OC 03.png';
import logoImage from './public/logo.png';
import { EstimatePDF } from './EstimatePDF';

interface EstimateData {
  companyName: string;
  projectName: string;
  quantity: number;
  stitches: number;
  baseRate: number;
  setupFee: number;
  materialCost: number;
  threadCost: number;
  complexityMultiplier: number;
  numberOfAppliques: number;
  appliqueRate: number;
  rushOrder: boolean;
}

interface CostBreakdown {
  stitchCost: number;
  materialCost: number;
  threadCost: number;
  setupFee: number;
  appliqueCost: number;
  complexityAdjustment: number;
  rushFee: number;
  subtotal: number;
  total: number;
  grandTotal: number;
}

// 東京市場に合わせた価格設定（日本円）- 更新版
const PRESETS = {
  bringYourOwn: {
    baseRate: 80,
    setupFee: 3000,
    materialCost: 0,
    threadCost: 150,
    complexityMultiplier: 1.0,
    numberOfAppliques: 0,
    appliqueRate: 100,
  },
  cap: {
    baseRate: 80,
    setupFee: 3000,
    materialCost: 1500,
    threadCost: 150,
    complexityMultiplier: 1.1,
    numberOfAppliques: 0,
    appliqueRate: 100,
  },
  polo: {
    baseRate: 80,
    setupFee: 5000,
    materialCost: 2000,
    threadCost: 200,
    complexityMultiplier: 1.0,
    numberOfAppliques: 0,
    appliqueRate: 100,
  },
  jacket: {
    baseRate: 80,
    setupFee: 8000,
    materialCost: 5800,
    threadCost: 400,
    complexityMultiplier: 1.3,
    numberOfAppliques: 0,
    appliqueRate: 150,
  },
  custom: {
    baseRate: 80,
    setupFee: 4000,
    materialCost: 2000,
    threadCost: 200,
    complexityMultiplier: 1.0,
    numberOfAppliques: 0,
    appliqueRate: 100,
  },
};

// 复杂度选项的显示文本映射
const COMPLEXITY_LABELS: { [key: string]: string } = {
  '0.8': '簡易（テキスト・シンプル図形）',
  '1.0': '標準（通常のデザイン）',
  '1.2': '複雑（細部のあるデザイン）',
  '1.5': '高密度（緻密なアートワーク）',
  '2.0': 'プレミアム（写真・3D刺繍）',
};

export default function App() {
  const [estimateData, setEstimateData] =
    useState<EstimateData>({
      companyName: "Beauxsacs Embroidery and Monogramming",
      projectName: "",
      quantity: 1,
      stitches: 8000,
      baseRate: 80,
      setupFee: 4000,
      materialCost: 2000,
      threadCost: 200,
      complexityMultiplier: 1.0,
      numberOfAppliques: 0,
      appliqueRate: 100,
      rushOrder: false,
    });

  const [breakdown, setBreakdown] = useState<CostBreakdown>({
    stitchCost: 0,
    materialCost: 0,
    threadCost: 0,
    setupFee: 0,
    appliqueCost: 0,
    complexityAdjustment: 0,
    rushFee: 0,
    subtotal: 0,
    total: 0,
    grandTotal: 0,
  });

  const calculateEstimate = () => {
    const stitchCost =
      (estimateData.stitches / 1000) * estimateData.baseRate;
    const appliqueCost =
      estimateData.numberOfAppliques *
      estimateData.appliqueRate;
    const complexityAdjustment =
      stitchCost * (estimateData.complexityMultiplier - 1);
    const setupFeePerItem = estimateData.setupFee / estimateData.quantity;
    const rushFee = estimateData.rushOrder ? 4000 : 0;

    const subtotal =
      stitchCost +
      estimateData.materialCost +
      estimateData.threadCost +
      setupFeePerItem +
      appliqueCost +
      complexityAdjustment;
    const total = subtotal + rushFee;
    const grandTotal = (subtotal * estimateData.quantity) + (estimateData.rushOrder ? 4000 : 0);

    setBreakdown({
      stitchCost,
      materialCost: estimateData.materialCost,
      threadCost: estimateData.threadCost,
      setupFee: setupFeePerItem,
      appliqueCost,
      complexityAdjustment,
      rushFee,
      subtotal,
      total,
      grandTotal,
    });
  };

  useEffect(() => {
    calculateEstimate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estimateData]);

  const applyPreset = (presetKey: string) => {
    if (presetKey !== "custom") {
      const preset = PRESETS[presetKey as keyof typeof PRESETS];
      setEstimateData((prev) => ({
        ...prev,
        ...preset,
      }));
    }
  };

  const updateField = (
    field: keyof EstimateData,
    value: number | boolean | string,
  ) => {
    setEstimateData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generatePDF = async () => {
    try {
      const currentDate = new Date().toLocaleDateString('ja-JP');

      const blob = await pdf(
        <EstimatePDF
          estimateData={estimateData}
          breakdown={breakdown}
          currentDate={currentDate}
        />
      ).toBlob();

      const filename = estimateData.projectName
        ? `${estimateData.projectName}_見積書.pdf`
        : "刺繍見積書.pdf";

      saveAs(blob, filename);
    } catch (error) {
      console.error('PDF生成エラー:', error);
      alert('PDFの生成に失敗しました。もう一度お試しください。');
    }
  };

  return (
    <div className="min-h-screen py-4 px-2 sm:p-6" style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー部分 - Logo with proper spacing */}
        <div className="mb-12 sm:mb-16 text-center pt-20 sm:pt-24 pb-10 sm:pb-14">
          <div className="mb-8 sm:mb-12 flex justify-center">
            <img
              src={logoImage}
              alt="EMBROVO TOKYO"
              className="h-24 sm:h-32 md:h-40 w-auto object-contain"
            />
          </div>
          <p className="text-xl sm:text-2xl md:text-3xl text-white font-medium mb-3">
            刺繍コスト見積りシミュレーター
          </p>
          <p className="text-base sm:text-lg md:text-xl text-white mt-3">
            針数と複雑さに基づき、ミシン刺繍プロジェクトの正確な価格を算出します
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 lg:items-start pb-16 sm:pb-20">
          {/* 左側：入力フォーム */}
          <div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calculator className="h-5 w-5" />
                  ご依頼内容の入力
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  刺繍プロジェクトの詳細を入力してください
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="companyName" className="text-sm">
                    貴社名 / お名前
                  </Label>
                  <Input
                    id="companyName"
                    type="text"
                    value={estimateData.companyName}
                    onChange={(e) =>
                      updateField("companyName", e.target.value)
                    }
                    placeholder="会社名または氏名を入力..."
                    className="text-sm h-8"
                  />
                </div>

                <div>
                  <Label htmlFor="projectName" className="text-sm">
                    案件名（品名）
                  </Label>
                  <Input
                    id="projectName"
                    type="text"
                    value={estimateData.projectName}
                    onChange={(e) =>
                      updateField("projectName", e.target.value)
                    }
                    placeholder="案件名（品名）..."
                    className="text-sm h-8"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="preset" className="text-sm">制作アイテム選択</Label>
                    <Select onValueChange={applyPreset}>
                      <SelectTrigger className="text-sm h-8">
                        <SelectValue placeholder="プリセットを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bringYourOwn">
                          持ち込み刺繍サービス
                        </SelectItem>
                        <SelectItem value="cap">
                          ベースボールキャップ
                        </SelectItem>
                        <SelectItem value="polo">
                          ポロシャツ
                        </SelectItem>
                        <SelectItem value="jacket">
                          ジャケット / パーカー
                        </SelectItem>
                        <SelectItem value="custom">
                          カスタム（自由入力）
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="quantity" className="text-sm">数量</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={estimateData.quantity}
                      onChange={(e) =>
                        updateField(
                          "quantity",
                          parseInt(e.target.value) || 1,
                        )
                      }
                      placeholder="1"
                      className="text-sm h-8"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="stitches" className="text-sm">
                    総針数（デザインの針数）
                  </Label>
                  <Input
                    id="stitches"
                    type="number"
                    value={estimateData.stitches}
                    onChange={(e) =>
                      updateField(
                        "stitches",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    placeholder="8000"
                    className="text-sm h-8"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="baseRate" className="text-sm">
                      1,000針あたりの単価 (¥)
                    </Label>
                    <Input
                      id="baseRate"
                      type="number"
                      step="1"
                      value={estimateData.baseRate}
                      onChange={(e) =>
                        updateField(
                          "baseRate",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      placeholder="80"
                      className="text-sm h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="setupFee" className="text-sm">
                      刺繍型代（パンチング料金）(¥)
                    </Label>
                    <Input
                      id="setupFee"
                      type="number"
                      step="100"
                      value={estimateData.setupFee}
                      onChange={(e) =>
                        updateField(
                          "setupFee",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      placeholder="4000"
                      className="text-sm h-8"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="materialCost" className="text-sm">
                      ボディ・生地代 (¥)
                    </Label>
                    <Input
                      id="materialCost"
                      type="number"
                      step="100"
                      value={estimateData.materialCost}
                      onChange={(e) =>
                        updateField(
                          "materialCost",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      placeholder="2000"
                      className="text-sm h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="threadCost" className="text-sm">
                      糸・副資材費 (¥)
                    </Label>
                    <Input
                      id="threadCost"
                      type="number"
                      step="50"
                      value={estimateData.threadCost}
                      onChange={(e) =>
                        updateField(
                          "threadCost",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      placeholder="200"
                      className="text-sm h-8"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="numberOfAppliques" className="text-sm">
                      アップリケの個数
                    </Label>
                    <Input
                      id="numberOfAppliques"
                      type="number"
                      value={estimateData.numberOfAppliques}
                      onChange={(e) =>
                        updateField(
                          "numberOfAppliques",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      placeholder="0"
                      className="text-sm h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="appliqueRate" className="text-sm">
                      アップリケ追加単価 (¥)
                    </Label>
                    <Input
                      id="appliqueRate"
                      type="number"
                      step="50"
                      value={estimateData.appliqueRate}
                      onChange={(e) =>
                        updateField(
                          "appliqueRate",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      placeholder="100"
                      className="text-sm h-8"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="complexity" className="text-sm">
                    デザイン難易度（倍率）
                  </Label>
                  <Select
                    value={estimateData.complexityMultiplier.toString()}
                    onValueChange={(value: string) =>
                      updateField(
                        "complexityMultiplier",
                        parseFloat(value),
                      )
                    }
                  >
                    <SelectTrigger className="text-sm h-8">
                      <SelectValue>
                        {COMPLEXITY_LABELS[estimateData.complexityMultiplier.toString()]}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.8">
                        簡易（テキスト・シンプル図形）
                      </SelectItem>
                      <SelectItem value="1.0">
                        標準（通常のデザイン）
                      </SelectItem>
                      <SelectItem value="1.2">
                        複雑（細部のあるデザイン）
                      </SelectItem>
                      <SelectItem value="1.5">
                        高密度（緻密なアートワーク）
                      </SelectItem>
                      <SelectItem value="2.0">
                        プレミアム（写真・3D刺繍）
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="rushOrder"
                    checked={estimateData.rushOrder}
                    onChange={(e) =>
                      updateField("rushOrder", e.target.checked)
                    }
                    className="rounded border-border"
                  />
                  <Label
                    htmlFor="rushOrder"
                    className="flex items-center gap-2 text-sm"
                  >
                    <Zap className="h-4 w-4" />
                    特急対応 / お急ぎ便 (+¥4,000)
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右側：見積り結果 */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  お見積り明細
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  料金算出の詳細
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      刺繍加工賃 (
                      {estimateData.stitches.toLocaleString()}{" "}
                      針)
                    </span>
                    <span>
                      ¥{Math.round(breakdown.stitchCost).toLocaleString()}
                    </span>
                  </div>

                  {breakdown.complexityAdjustment > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        難易度による調整
                      </span>
                      <span>
                        +¥
                        {Math.round(breakdown.complexityAdjustment).toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      刺繍型代（初回のみ） {estimateData.quantity > 1 ? `(¥${estimateData.setupFee.toLocaleString()} ÷ ${estimateData.quantity})` : ''}
                    </span>
                    <span>
                      ¥{Math.round(breakdown.setupFee).toLocaleString()}
                    </span>
                  </div>

                  {estimateData.materialCost > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        ボディ・生地代
                      </span>
                      <span>
                        ¥{Math.round(breakdown.materialCost).toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      糸代
                    </span>
                    <span>
                      ¥{Math.round(breakdown.threadCost).toLocaleString()}
                    </span>
                  </div>

                  {breakdown.appliqueCost > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        アップリケ費用 (
                        {estimateData.numberOfAppliques}{" "}
                        个)
                      </span>
                      <span>
                        ¥{Math.round(breakdown.appliqueCost).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {breakdown.rushFee > 0 && (
                    <>
                      <Separator className="my-2" />
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          小計
                        </span>
                        <span>
                          ¥{Math.round(breakdown.subtotal).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-orange-600">
                        <span>
                          特急対応費（一律）
                        </span>
                        <span>
                          +¥{Math.round(breakdown.rushFee).toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <Separator className="my-2" />

                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span>1点あたりの合計</span>
                  <Badge
                    variant="outline"
                    className="px-2 py-1 text-sm"
                  >
                    ¥{Math.round(breakdown.total).toLocaleString()}
                  </Badge>
                </div>

                {estimateData.quantity > 1 && (
                  <div className="flex justify-between items-center text-base sm:text-lg font-medium">
                    <span>
                      総合計 ({estimateData.quantity}{" "}
                      点)
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-base sm:text-lg px-3 py-1"
                    >
                      ¥{Math.round(breakdown.grandTotal).toLocaleString()}
                    </Badge>
                  </div>
                )}

                {estimateData.quantity === 1 && (
                  <div className="flex justify-between items-center text-base sm:text-lg font-medium">
                    <span>お見積り合計</span>
                    <Badge
                      variant="secondary"
                      className="text-base sm:text-lg px-3 py-1"
                    >
                      ¥{Math.round(breakdown.total).toLocaleString()}
                    </Badge>
                  </div>
                )}

                <div className="mt-3 p-3 bg-muted rounded-lg text-xs sm:text-sm space-y-1">
                  <p className="text-muted-foreground">
                    1針あたりの単価:
                  </p>
                  <p>
                    ¥
                    {(
                      breakdown.total / estimateData.stitches
                    ).toFixed(2)}{" "}
                    / 針
                  </p>

                  <p className="text-muted-foreground pt-1">
                    製作時間の目安:
                  </p>
                  <p>
                    1点あたり約 {Math.ceil(estimateData.stitches / 800)}{" "}
                    分（800針/分換算）
                  </p>
                  {estimateData.quantity > 1 && (
                    <p>
                      総製作時間:{" "}
                      {Math.ceil(estimateData.stitches / 800) *
                        estimateData.quantity}{" "}
                      分
                    </p>
                  )}
                </div>

                <Button
                  onClick={generatePDF}
                  className="w-full mt-3"
                  variant="outline"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  PDF見積書をダウンロード
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:ml-0 lg:max-w-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base sm:text-lg">料金ガイドライン</CardTitle>
              </CardHeader>
              <CardContent className="text-xs sm:text-sm text-muted-foreground space-y-1">
                <p>
                  <strong>一般的な針数の目安:</strong>
                </p>
                <ul className="space-y-0.5 ml-4">
                  <li>• シンプルなロゴ: 3,000〜6,000針</li>
                  <li>• 標準的なロゴ: 6,000〜12,000針</li>
                  <li>• 複雑なデザイン: 12,000〜25,000針</li>
                  <li>• 背面の大型デザイン: 25,000〜50,000針</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}