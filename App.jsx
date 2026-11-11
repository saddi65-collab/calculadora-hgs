import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  User, 
  Check, 
  Copy, 
  AlertTriangle, 
  BookOpen, 
  CheckCircle2,
  XCircle
} from 'lucide-react';

// ==========================================
// DATASETS & REFERENCE NORMS
// ==========================================

// ELSI-Brasil Reference Data (Moreira et al., 2022) - Age range: 50 to 110
const ELSI_DATA = {
  male: [
    { ageGroup: '50-54', ageMin: 50, ageMax: 54, p5: 22.0, p10: 25.0, p20: 29.5, p25: 31.0, p50: 35.5, p75: 41.0, p90: 46.0, p95: 50.0 },
    { ageGroup: '55-59', ageMin: 55, ageMax: 59, p5: 20.5, p10: 23.5, p20: 28.0, p25: 29.5, p50: 34.0, p75: 39.5, p90: 44.5, p95: 48.0 },
    { ageGroup: '60-64', ageMin: 60, ageMax: 64, p5: 19.0, p10: 22.0, p20: 26.0, p25: 27.5, p50: 32.0, p75: 37.5, p90: 42.5, p95: 46.0 },
    { ageGroup: '65-69', ageMin: 65, ageMax: 69, p5: 17.5, p10: 20.0, p20: 24.0, p25: 25.5, p50: 30.0, p75: 35.5, p90: 40.5, p95: 44.0 },
    { ageGroup: '70-74', ageMin: 70, ageMax: 74, p5: 16.0, p10: 18.5, p20: 22.0, p25: 23.5, p50: 28.0, p75: 33.0, p90: 38.0, p95: 41.5 },
    { ageGroup: '75-79', ageMin: 75, ageMax: 79, p5: 14.0, p10: 16.5, p20: 20.0, p25: 21.0, p50: 25.5, p75: 30.5, p90: 35.5, p95: 38.5 },
    { ageGroup: '80-84', ageMin: 80, ageMax: 84, p5: 12.0, p10: 14.5, p20: 17.5, p25: 18.5, p50: 23.0, p75: 27.5, p90: 32.5, p95: 35.5 },
    { ageGroup: '85+',   ageMin: 85, ageMax: 110, p5: 9.5, p10: 12.0, p20: 15.0, p25: 16.0, p50: 20.0, p75: 24.0, p90: 29.0, p95: 32.0 },
  ],
  female: [
    { ageGroup: '50-54', ageMin: 50, ageMax: 54, p5: 12.5, p10: 14.5, p20: 17.0, p25: 18.0, p50: 22.0, p75: 26.0, p90: 29.5, p95: 32.0 },
    { ageGroup: '55-59', ageMin: 55, ageMax: 59, p5: 11.5, p10: 13.8, p20: 16.2, p25: 17.0, p50: 21.0, p75: 25.0, p90: 28.5, p95: 31.0 },
    { ageGroup: '60-64', ageMin: 60, ageMax: 64, p5: 10.8, p10: 13.0, p20: 15.5, p25: 16.2, p50: 20.0, p75: 24.0, p90: 27.5, p95: 29.5 },
    { ageGroup: '65-69', ageMin: 65, ageMax: 69, p5: 10.0, p10: 12.0, p20: 14.5, p25: 15.2, p50: 19.0, p75: 22.8, p90: 26.0, p95: 28.2 },
    { ageGroup: '70-74', ageMin: 70, ageMax: 74, p5: 9.0,  p10: 11.0, p20: 13.5, p25: 14.2, p50: 17.8, p75: 21.5, p90: 24.8, p95: 26.8 },
    { ageGroup: '75-79', ageMin: 75, ageMax: 79, p5: 8.0,  p10: 9.8,  p20: 12.2, p25: 13.0, p50: 16.5, p75: 20.0, p90: 23.2, p95: 25.0 },
    { ageGroup: '80-84', ageMin: 80, ageMax: 84, p5: 6.8,  p10: 8.5,  p20: 10.8, p25: 11.5, p50: 15.0, p75: 18.2, p90: 21.5, p95: 23.2 },
    { ageGroup: '85+',   ageMin: 85, ageMax: 110, p5: 5.0,  p10: 6.8,  p20: 9.0,  p25: 10.0, p50: 13.2, p75: 16.5, p90: 19.5, p95: 21.5 },
  ]
};

// PURE Study Data Model (Leong et al., 2016) - Age range: 30 to 80
const PURE_DATA = {
  male: [
    { ageMin: 30, ageMax: 39, mean: 46.5, sd: 8.5, ewgsopCutoff: 27 },
    { ageMin: 40, ageMax: 49, mean: 43.8, sd: 8.2, ewgsopCutoff: 27 },
    { ageMin: 50, ageMax: 59, mean: 40.2, sd: 8.0, ewgsopCutoff: 27 },
    { ageMin: 60, ageMax: 69, mean: 36.0, sd: 7.8, ewgsopCutoff: 27 },
    { ageMin: 70, ageMax: 80, mean: 31.2, sd: 7.5, ewgsopCutoff: 27 },
  ],
  female: [
    { ageMin: 30, ageMax: 39, mean: 28.5, sd: 5.8, ewgsopCutoff: 16 },
    { ageMin: 40, ageMax: 49, mean: 27.2, sd: 5.5, ewgsopCutoff: 16 },
    { ageMin: 50, ageMax: 59, mean: 24.8, sd: 5.2, ewgsopCutoff: 16 },
    { ageMin: 60, ageMax: 69, mean: 21.9, sd: 5.0, ewgsopCutoff: 16 },
    { ageMin: 70, ageMax: 80, mean: 19.2, sd: 4.8, ewgsopCutoff: 16 },
  ]
};

// Helper: Standard Normal Z-Score to Percentile
function zToPercentile(z) {
  if (z < -6.5) return 0.01;
  if (z > 6.5) return 99.99;
  
  const b1 = 0.319381530;
  const b2 = -0.356563782;
  const b3 = 1.781477937;
  const b4 = -1.821255978;
  const b5 = 1.330274429;
  const p = 0.2316419;
  const c = 0.39894228;

  const absoluteZ = Math.abs(z);
  const t = 1.0 / (1.0 + p * absoluteZ);
  const pdf = c * Math.exp(-0.5 * absoluteZ * absoluteZ);
  let prob = 1.0 - pdf * t * (b1 + t * (b2 + t * (b3 + t * (b4 + t * b5))));

  if (z < 0) {
    prob = 1.0 - prob;
  }
  return prob * 100;
}

export default function App() {
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState(62);
  const [hgsVal1, setHgsVal1] = useState('34');
  const [hgsVal2, setHgsVal2] = useState('');
  const [patientId, setPatientId] = useState('');
  const [copied, setCopied] = useState(false);

  // Compute values for both studies simultaneously
  const evaluation = useMemo(() => {
    const v1 = parseFloat(hgsVal1);
    const v2 = parseFloat(hgsVal2);
    const ageNum = parseInt(age, 10);

    let val = 0;
    let isAverage = false;

    if (!isNaN(v1) && !isNaN(v2) && v1 > 0 && v2 > 0) {
      val = (v1 + v2) / 2;
      isAverage = true;
    } else if (!isNaN(v1) && v1 > 0) {
      val = v1;
      isAverage = false;
    } else if (!isNaN(v2) && v2 > 0) {
      val = v2;
      isAverage = false;
    } else {
      return null;
    }

    if (isNaN(ageNum)) return null;

    const cutoff = gender === 'male' ? 27 : 16;
    const valUsed = Math.round(val * 10) / 10;

    // 1. ELSI-BRASIL CALCULATION (Valid range: 50-110 years)
    let elsiResult = null;
    if (ageNum < 50 || ageNum > 110) {
      elsiResult = {
        isValid: false,
        reason: `Não foi possível calcular para este estudo (idade fora da faixa de referência: 50-110 anos).`
      };
    } else {
      const elsiSet = ELSI_DATA[gender];
      let group = elsiSet.find(g => ageNum >= g.ageMin && ageNum <= g.ageMax);
      if (!group && ageNum >= 85) group = elsiSet[elsiSet.length - 1];

      if (group) {
        let percentile = 50;
        const points = [
          { p: 5, v: group.p5 },
          { p: 10, v: group.p10 },
          { p: 20, v: group.p20 },
          { p: 25, v: group.p25 },
          { p: 50, v: group.p50 },
          { p: 75, v: group.p75 },
          { p: 90, v: group.p90 },
          { p: 95, v: group.p95 }
        ];

        if (val <= group.p5) {
          percentile = Math.max(1, Math.round((val / group.p5) * 5));
        } else if (val >= group.p95) {
          percentile = Math.min(99, 95 + Math.round(((val - group.p95) / 10) * 4));
        } else {
          for (let i = 0; i < points.length - 1; i++) {
            if (val >= points[i].v && val <= points[i + 1].v) {
              const rangeV = points[i + 1].v - points[i].v;
              const rangeP = points[i + 1].p - points[i].p;
              const diff = val - points[i].v;
              percentile = points[i].p + (diff / rangeV) * rangeP;
              break;
            }
          }
        }

        let statusLabel = 'Força Normal / Adequada';
        let statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
        let badgeColor = 'bg-emerald-500';

        if (percentile < 10 || val < cutoff) {
          statusLabel = 'Dinapenia / Fraqueza (<P10 ou <Corte)';
          statusColor = 'text-rose-700 bg-rose-50 border-rose-200';
          badgeColor = 'bg-rose-500';
        } else if (percentile < 25) {
          statusLabel = 'Força Limítrofe / Baixa (P10 - P25)';
          statusColor = 'text-amber-700 bg-amber-50 border-amber-200';
          badgeColor = 'bg-amber-500';
        } else if (percentile >= 75) {
          statusLabel = 'Força Preservada / Elevada (>P75)';
          statusColor = 'text-blue-700 bg-blue-50 border-blue-200';
          badgeColor = 'bg-blue-500';
        }

        elsiResult = {
          isValid: true,
          percentile: Math.round(percentile * 10) / 10,
          groupLabel: group.ageGroup,
          referenceP10: group.p10,
          referenceP50: group.p50,
          referenceP90: group.p90,
          statusLabel,
          statusColor,
          badgeColor
        };
      }
    }

    // 2. PURE STUDY CALCULATION (Valid range: 30-80 years)
    let pureResult = null;
    if (ageNum < 30 || ageNum > 80) {
      pureResult = {
        isValid: false,
        reason: `Não foi possível calcular para este estudo (idade fora da faixa de referência: 30-80 anos).`
      };
    } else {
      const pureSet = PURE_DATA[gender];
      let group = pureSet.find(g => ageNum >= g.ageMin && ageNum <= g.ageMax);
      
      if (group) {
        const zScore = (val - group.mean) / group.sd;
        const percentile = zToPercentile(zScore);

        let statusLabel = 'Força Dentro do Esperado';
        let statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
        let badgeColor = 'bg-emerald-500';

        if (val < cutoff || percentile < 10) {
          statusLabel = 'Dinapenia / Fraqueza (<P10)';
          statusColor = 'text-rose-700 bg-rose-50 border-rose-200';
          badgeColor = 'bg-rose-500';
        } else if (percentile < 25) {
          statusLabel = 'Força Abaixo da Média (P10 - P25)';
          statusColor = 'text-amber-700 bg-amber-50 border-amber-200';
          badgeColor = 'bg-amber-500';
        } else if (percentile >= 75) {
          statusLabel = 'Força Acima da Média (>P75)';
          statusColor = 'text-blue-700 bg-blue-50 border-blue-200';
          badgeColor = 'bg-blue-500';
        }

        pureResult = {
          isValid: true,
          percentile: Math.round(percentile * 10) / 10,
          groupLabel: `${group.ageMin}-${group.ageMax} anos`,
          referenceP10: Math.round((group.mean - 1.28 * group.sd) * 10) / 10,
          referenceP50: group.mean,
          referenceP90: Math.round((group.mean + 1.28 * group.sd) * 10) / 10,
          statusLabel,
          statusColor,
          badgeColor
        };
      }
    }

    return {
      valUsed,
      isAverage,
      val1: v1 || null,
      val2: v2 || null,
      cutoff,
      elsi: elsiResult,
      pure: pureResult
    };
  }, [hgsVal1, hgsVal2, age, gender]);

  // Copy unified report for clinical records
  const copyClinicalNote = () => {
    if (!evaluation) return;
    const measuresText = evaluation.isAverage 
      ? `Medida 1: ${evaluation.val1} kg | Medida 2: ${evaluation.val2} kg (Média: ${evaluation.valUsed} kg)`
      : `Medida única considerada: ${evaluation.valUsed} kg`;

    const elsiText = evaluation.elsi.isValid 
      ? `- ELSI-Brasil (Moreira et al., 2022): Percentil P${evaluation.elsi.percentile} | Classificação: ${evaluation.elsi.statusLabel}`
      : `- ELSI-Brasil: ${evaluation.elsi.reason}`;

    const pureText = evaluation.pure.isValid 
      ? `- PURE Study (Leong et al., 2016): Percentil P${evaluation.pure.percentile} | Classificação: ${evaluation.pure.statusLabel}`
      : `- PURE Study: ${evaluation.pure.reason}`;

    const text = `AVALIAÇÃO DE FORÇA DE PREENSÃO MANUAL (HGS) - RELATÓRIO DUPLO
------------------------------------------------------------------
Identificação/Prontuário: ${patientId || 'Não informado'}
Sexo: ${gender === 'male' ? 'Masculino' : 'Feminino'} | Idade: ${age} anos
Ponto de Corte EWGSOP2 (Dinapenia): < ${evaluation.cutoff} kg

MEDIDAS DE HGS:
- ${measuresText}

RESULTADOS COMPARATIVOS:
${elsiText}
${pureText}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 sm:p-6 md:p-8">
      {/* HEADER */}
      <header className="max-w-6xl mx-auto mb-8 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-3 rounded-xl text-white shadow-md shadow-blue-500/20">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Calculadora de HGS (ELSI-Brasil & PURE Study)
            </h1>
            <p className="text-sm text-slate-500">
              Análise simultânea de percentis normativos por estudos nacional e internacional
            </p>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INPUT FORM PANEL */}
        <section className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between h-fit">
          <div>
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" /> Paciente & Medidas
              </h2>
            </div>

            <div className="space-y-5">
              {/* Patient ID Optional */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Identificação / Prontuário (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: PAC-10492"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Sexo Biológico
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                      gender === 'male'
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm ring-1 ring-blue-500 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>👨 Masculino</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                      gender === 'female'
                        ? 'bg-pink-50 border-pink-500 text-pink-700 shadow-sm ring-1 ring-pink-500 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>👩 Feminino</span>
                  </button>
                </div>
              </div>

              {/* Age */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Idade (Anos)
                  </label>
                  <span className="text-xs text-blue-600 font-bold">{age} anos</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={18}
                    max={100}
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <input
                    type="number"
                    min={18}
                    max={110}
                    value={age}
                    onChange={(e) => setAge(e.target.value ? parseInt(e.target.value, 10) : '')}
                    className="w-20 px-3 py-2 rounded-xl border border-slate-300 text-center font-bold text-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* HGS Dual Values */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Força Medida (kgf / kg)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Medida 1 (kg)</span>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="100"
                      placeholder="Ex: 34"
                      value={hgsVal1}
                      onChange={(e) => setHgsVal1(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Medida 2 (Opcional)</span>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="100"
                      placeholder="Ex: 36"
                      value={hgsVal2}
                      onChange={(e) => setHgsVal2(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  *Se inseridas duas medidas, a <strong>média</strong> é usada automaticamente para os cálculos.
                </p>
              </div>
            </div>
          </div>

          {evaluation && (
            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={copyClinicalNote}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" /> Copiado com sucesso!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copiar Relatório Completo
                  </>
                )}
              </button>
            </div>
          )}
        </section>

        {/* DUAL RESULTS PANEL */}
        <section className="lg:col-span-8 space-y-6">
          {evaluation ? (
            <>
              {/* Top Banner Summarizing Measurement */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Valor HGS Considerado</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">{evaluation.valUsed} kg</span>
                    {evaluation.isAverage && (
                      <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                        Média de {evaluation.val1}kg e {evaluation.val2}kg
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Linha de Corte EWGSOP2</span>
                  <p className="text-sm font-bold text-slate-700">
                    &lt; {evaluation.cutoff} kg ({gender === 'male' ? 'Homem' : 'Mulher'})
                  </p>
                </div>
              </div>

              {/* 1. ELSI-BRASIL CARD */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    🇧🇷 ELSI-Brasil (Moreira et al., 2022)
                  </h3>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                    Faixa etária do estudo: 50 a 110 anos
                  </span>
                </div>

                {evaluation.elsi.isValid ? (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl border ${evaluation.elsi.statusColor} flex justify-between items-center`}>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider opacity-80 block">Classificação</span>
                        <span className="font-extrabold text-base">{evaluation.elsi.statusLabel}</span>
                      </div>
                      <span className={`px-3 py-1 text-sm font-bold text-white rounded-full ${evaluation.elsi.badgeColor}`}>
                        P{evaluation.elsi.percentile}
                      </span>
                    </div>

                    {/* Centile Gauge */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
                      <div className="flex justify-between items-center text-xs mb-2">
                        <span className="font-semibold text-slate-600">Curva Centílica ({evaluation.elsi.groupLabel})</span>
                        <span className="font-bold text-blue-700">Percentil P{evaluation.elsi.percentile}</span>
                      </div>
                      <div className="relative pt-5 pb-1">
                        <div 
                          className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-500"
                          style={{ left: `${Math.max(3, Math.min(97, evaluation.elsi.percentile))}%` }}
                        >
                          <span className="bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {evaluation.valUsed}kg
                          </span>
                          <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-slate-900"></div>
                        </div>
                        <div className="h-3.5 w-full rounded-lg overflow-hidden flex shadow-inner border border-slate-200">
                          <div className="w-[10%] bg-rose-400"></div>
                          <div className="w-[15%] bg-amber-300"></div>
                          <div className="w-[50%] bg-emerald-400"></div>
                          <div className="w-[25%] bg-blue-400"></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 text-center text-xs pt-3 border-t border-slate-200 mt-2">
                        <div><span className="text-slate-400 block text-[10px]">P10</span><span className="font-bold">{evaluation.elsi.referenceP10} kg</span></div>
                        <div><span className="text-slate-400 block text-[10px]">P50 (Mediana)</span><span className="font-bold">{evaluation.elsi.referenceP50} kg</span></div>
                        <div><span className="text-slate-400 block text-[10px]">P90</span><span className="font-bold">{evaluation.elsi.referenceP90} kg</span></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{evaluation.elsi.reason}</p>
                  </div>
                )}
              </div>

              {/* 2. PURE STUDY CARD */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    🌐 PURE Study (Leong et al., 2016)
                  </h3>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                    Faixa etária do estudo: 30 a 80 anos
                  </span>
                </div>

                {evaluation.pure.isValid ? (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl border ${evaluation.pure.statusColor} flex justify-between items-center`}>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider opacity-80 block">Classificação</span>
                        <span className="font-extrabold text-base">{evaluation.pure.statusLabel}</span>
                      </div>
                      <span className={`px-3 py-1 text-sm font-bold text-white rounded-full ${evaluation.pure.badgeColor}`}>
                        P{evaluation.pure.percentile}
                      </span>
                    </div>

                    {/* Centile Gauge */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
                      <div className="flex justify-between items-center text-xs mb-2">
                        <span className="font-semibold text-slate-600">Curva Centílica ({evaluation.pure.groupLabel})</span>
                        <span className="font-bold text-blue-700">Percentil P{evaluation.pure.percentile}</span>
                      </div>
                      <div className="relative pt-5 pb-1">
                        <div 
                          className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-500"
                          style={{ left: `${Math.max(3, Math.min(97, evaluation.pure.percentile))}%` }}
                        >
                          <span className="bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {evaluation.valUsed}kg
                          </span>
                          <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-slate-900"></div>
                        </div>
                        <div className="h-3.5 w-full rounded-lg overflow-hidden flex shadow-inner border border-slate-200">
                          <div className="w-[10%] bg-rose-400"></div>
                          <div className="w-[15%] bg-amber-300"></div>
                          <div className="w-[50%] bg-emerald-400"></div>
                          <div className="w-[25%] bg-blue-400"></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 text-center text-xs pt-3 border-t border-slate-200 mt-2">
                        <div><span className="text-slate-400 block text-[10px]">P10</span><span className="font-bold">{evaluation.pure.referenceP10} kg</span></div>
                        <div><span className="text-slate-400 block text-[10px]">P50 (Média)</span><span className="font-bold">{evaluation.pure.referenceP50} kg</span></div>
                        <div><span className="text-slate-400 block text-[10px]">P90</span><span className="font-bold">{evaluation.pure.referenceP90} kg</span></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{evaluation.pure.reason}</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="h-full bg-white rounded-2xl border border-slate-200/80 p-8 flex flex-col items-center justify-center text-center text-slate-400">
              <Activity className="w-12 h-12 mb-3 text-slate-300" />
              <p className="font-medium text-slate-600">Preencha os dados no formulário ao lado</p>
              <p className="text-xs mt-1">Os cálculos para ELSI-Brasil e PURE Study serão exibidos simultaneamente.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}