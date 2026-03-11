export default function StatCard({ title, value, children }: { title: string; value: string | number; children?: React.ReactNode }) {
  return (
    <div className="card-bg p-4 rounded-lg shadow min-h-[100px]">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-400">{title}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}

