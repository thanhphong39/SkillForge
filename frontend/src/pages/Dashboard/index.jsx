import { useUIStore } from '../../store/uiStore.js'
import { usePerspectiveSummary, useDepartmentComparison } from '../../hooks/useKPICalculations.js'
import { PERSPECTIVES } from '../../constants/bsc.js'
import { PageHeader } from '../../components/layout/PageHeader.jsx'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { RatingBadge } from '../../components/ui/RatingBadge.jsx'
import { ProgressBar } from '../../components/ui/ProgressBar.jsx'
import { BSCScorecard } from './BSCScorecard.jsx'
import { PerspectiveCard } from './PerspectiveCard.jsx'
import { DepartmentComparison } from './DepartmentComparison.jsx'

export default function DashboardPage() {
  const { activePeriod } = useUIStore()
  return (
    <div>
      <PageHeader title="Tổng quan SkillForge" subtitle={`Kỳ đánh giá: ${activePeriod}`} />

      {/* 4 Perspective cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {PERSPECTIVES.map(p => <PerspectiveCard key={p.id} perspectiveId={p.id} period={activePeriod} />)}
      </div>

      {/* Scorecard + Department chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <BSCScorecard period={activePeriod} />
        </div>
        <div>
          <DepartmentComparison period={activePeriod} />
        </div>
      </div>
    </div>
  )
}
