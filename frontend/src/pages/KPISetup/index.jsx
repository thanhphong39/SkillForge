import { useState } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { KPITree } from './KPITree.jsx'
import { KPIForm } from './KPIForm.jsx'

export default function KPISetupPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingKPI, setEditingKPI] = useState(null)
  const [parentKPI, setParentKPI] = useState(null)

  function openAdd(parent = null) {
    setParentKPI(parent)
    setEditingKPI(null)
    setFormOpen(true)
  }

  function openEdit(kpi) {
    setEditingKPI(kpi)
    setParentKPI(null)
    setFormOpen(true)
  }

  return (
    <div>
      <PageHeader
        title="Thiết lập & Phân rã KPI"
        subtitle="Xây dựng hệ thống KPI từ cấp công ty đến phòng ban và cá nhân"
        action={<Button onClick={() => openAdd()} icon={<Plus size={16} />}>Thêm KPI công ty</Button>}
      />
      <KPITree onEdit={openEdit} onAddChild={openAdd} />
      <KPIForm open={formOpen} onClose={() => setFormOpen(false)} editingKPI={editingKPI} parentKPI={parentKPI} />
    </div>
  )
}
