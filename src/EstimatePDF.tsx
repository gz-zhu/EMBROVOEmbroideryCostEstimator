import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import logoBlackImage from './public/logoblack.png';

// 注册日文字体
Font.register({
    family: 'NotoSansJP',
    src: 'https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEi75vY0rw-oME.ttf'
});

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'NotoSansJP',
        fontSize: 11,
        backgroundColor: '#FFFFFF',
    },
    logo: {
        width: 100,
        height: 'auto',
        marginBottom: 15,
        alignSelf: 'center',
    },
    title: {
        fontSize: 22,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        fontSize: 11,
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#2980B9',
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 8,
        color: '#2C3E50',
        backgroundColor: '#ECF0F1',
        padding: 6,
    },

    // 表格样式
    table: {
        width: '100%',
        marginBottom: 12,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#BDC3C7',
        minHeight: 28,
    },
    tableRowEven: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#BDC3C7',
        backgroundColor: '#F8F9FA',
        minHeight: 28,
    },
    tableHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#2980B9',
        minHeight: 32,
        borderBottomWidth: 2,
        borderBottomColor: '#21618C',
    },

    // 项目详情表格
    detailLabel: {
        width: '35%',
        padding: 6,
        fontSize: 9,
        fontWeight: 'bold',
        borderRightWidth: 1,
        borderRightColor: '#BDC3C7',
    },
    detailValue: {
        width: '65%',
        padding: 6,
        fontSize: 9,
    },
    detailLabelHeader: {
        width: '35%',
        padding: 6,
        fontSize: 10,
        fontWeight: 'bold',
        color: 'white',
        borderRightWidth: 1,
        borderRightColor: '#21618C',
    },
    detailValueHeader: {
        width: '65%',
        padding: 6,
        fontSize: 10,
        fontWeight: 'bold',
        color: 'white',
    },

    // 费用表格
    costLabel: {
        width: '70%',
        padding: 6,
        fontSize: 9,
        borderRightWidth: 1,
        borderRightColor: '#BDC3C7',
    },
    costValue: {
        width: '30%',
        padding: 6,
        fontSize: 9,
        textAlign: 'right',
        fontWeight: 'bold',
    },

    // 总计行
    totalRow: {
        flexDirection: 'row',
        backgroundColor: '#3498DB',
        minHeight: 32,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#2980B9',
    },
    totalLabel: {
        width: '70%',
        padding: 8,
        fontSize: 11,
        fontWeight: 'bold',
        color: 'white',
    },
    totalValue: {
        width: '30%',
        padding: 8,
        fontSize: 12,
        textAlign: 'right',
        fontWeight: 'bold',
        color: 'white',
    },

    // 最终总计行
    grandTotalRow: {
        flexDirection: 'row',
        backgroundColor: '#F39C12',
        minHeight: 36,
        marginTop: 4,
        borderWidth: 2,
        borderColor: '#D68910',
    },
    grandTotalLabel: {
        width: '70%',
        padding: 8,
        fontSize: 12,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    grandTotalValue: {
        width: '30%',
        padding: 8,
        fontSize: 14,
        textAlign: 'right',
        fontWeight: 'bold',
        color: '#2C3E50',
    },

    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 8,
        color: '#7F8C8D',
        borderTopWidth: 1,
        borderTopColor: '#BDC3C7',
        paddingTop: 8,
    },
});

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

interface EstimatePDFProps {
    estimateData: EstimateData;
    breakdown: CostBreakdown;
    currentDate: string;
}

export const EstimatePDF: React.FC<EstimatePDFProps> = ({ estimateData, breakdown, currentDate }) => {
    // 准备项目详情数据
    const projectDetails = [
        { label: '案件名（品名）', value: estimateData.projectName || '無題プロジェクト' },
        { label: '数量', value: `${estimateData.quantity} 点` },
        { label: '1点あたりの針数', value: `${estimateData.stitches.toLocaleString()} 針` },
        { label: '難易度', value: `${estimateData.complexityMultiplier} 倍` },
    ];

    if (estimateData.numberOfAppliques > 0) {
        projectDetails.push({
            label: 'アップリケ',
            value: `1点あたり ${estimateData.numberOfAppliques} 個`
        });
    }

    if (estimateData.rushOrder) {
        projectDetails.push({
            label: '特急対応',
            value: 'あり (+¥4,000)'
        });
    }

    // 准备费用明细数据
    const costItems = [
        {
            label: `刺繍加工賃 (${estimateData.stitches.toLocaleString()} 針)`,
            value: `¥${Math.round(breakdown.stitchCost).toLocaleString()}`
        }
    ];

    if (breakdown.complexityAdjustment > 0) {
        costItems.push({
            label: '難易度による調整',
            value: `¥${Math.round(breakdown.complexityAdjustment).toLocaleString()}`
        });
    }

    const setupFeeLabel = estimateData.quantity > 1
        ? `刺繍型代（初回のみ） (¥${estimateData.setupFee.toLocaleString()} ÷ ${estimateData.quantity})`
        : '刺繍型代（初回のみ）';

    costItems.push({
        label: setupFeeLabel,
        value: `¥${Math.round(breakdown.setupFee).toLocaleString()}`
    });

    if (estimateData.materialCost > 0) {
        costItems.push({
            label: 'ボディ・生地代',
            value: `¥${Math.round(breakdown.materialCost).toLocaleString()}`
        });
    }

    costItems.push({
        label: '糸代',
        value: `¥${Math.round(breakdown.threadCost).toLocaleString()}`
    });

    if (breakdown.appliqueCost > 0) {
        costItems.push({
            label: `アップリケ費用 (${estimateData.numberOfAppliques} 個)`,
            value: `¥${Math.round(breakdown.appliqueCost).toLocaleString()}`
        });
    }

    if (breakdown.rushFee > 0) {
        costItems.push({
            label: '特急対応費（一律）',
            value: `¥${Math.round(breakdown.rushFee).toLocaleString()}`
        });
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Logo */}
                <Image src={logoBlackImage} style={styles.logo} />

                {/* Title */}
                <Text style={styles.title}>刺繍お見積書</Text>

                {/* Header */}
                <View style={styles.header}>
                    <Text>{estimateData.companyName}</Text>
                    <Text>日付: {currentDate}</Text>
                </View>

                {/* Project Details Section */}
                <Text style={styles.sectionTitle}>プロジェクト詳細</Text>
                <View style={styles.table}>
                    {/* Table Header */}
                    <View style={styles.tableHeaderRow}>
                        <Text style={styles.detailLabelHeader}>項目</Text>
                        <Text style={styles.detailValueHeader}>内容</Text>
                    </View>

                    {/* Table Rows */}
                    {projectDetails.map((item, index) => (
                        <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowEven}>
                            <Text style={styles.detailLabel}>{item.label}</Text>
                            <Text style={styles.detailValue}>{item.value}</Text>
                        </View>
                    ))}
                </View>

                {/* Cost Breakdown Section */}
                <Text style={styles.sectionTitle}>料金内訳（1点あたり）</Text>
                <View style={styles.table}>
                    {/* Cost Rows */}
                    {costItems.map((item, index) => (
                        <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowEven}>
                            <Text style={styles.costLabel}>{item.label}</Text>
                            <Text style={styles.costValue}>{item.value}</Text>
                        </View>
                    ))}
                </View>

                {/* Total per piece */}
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>1点あたりの合計</Text>
                    <Text style={styles.totalValue}>
                        ¥{Math.round(breakdown.total).toLocaleString()}
                    </Text>
                </View>

                {/* Grand Total */}
                <View style={styles.grandTotalRow}>
                    <Text style={styles.grandTotalLabel}>
                        総合計 ({estimateData.quantity} 点)
                    </Text>
                    <Text style={styles.grandTotalValue}>
                        ¥{Math.round(breakdown.grandTotal).toLocaleString()}
                    </Text>
                </View>

                {/* Footer */}
                <Text style={styles.footer}>
                    本見積は30日間有効です。諸条件が適用されます。
                </Text>
            </Page>
        </Document>
    );
};