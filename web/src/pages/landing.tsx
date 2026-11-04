const sports = [
  {
    name: 'Generic Sports',
    links: [
      ['Lower Third', '/lt'],
      ['Graph', '/graph'],
    ],
  },
  {
    name: 'Netball',
    links: [
      ['Lower Third', '/lt_netball'],
      ['Graph', '/graph_netball'],
    ],
  },
  {
    name: 'American Football',
    links: [
      ['Lower Third', '/lt_american_football'],
      ['Graph', '/graph_american_football'],
    ],
  },
  {
    name: 'Boxing',
    links: [['Timer Graphic', '/timer_boxing']],
  },
]

const controls = [
  ['Lower Third Control', '/lt_control'],
  ['Graph Control', '/graph_control'],
  ['Score Control', '/score_control'],
  ['Timer Control', '/timer_control_boxing'],
]

const standalone = [['Score Graphic', '/score']]

export default function Landing() {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-8 text-4xl font-bold">
        xpLosION Graphics
      </h1>

      <div className="mb-8 rounded-lg border p-5">
        <h2 className="mb-4 text-2xl font-bold">Controls</h2>

        <div className="grid gap-2 sm:grid-cols-2">
          {controls.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="rounded border p-3 font-semibold hover:bg-slate-100"
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <h2 className="mb-4 text-2xl font-bold">Sports</h2>

      <div className="grid gap-4 md:grid-cols-2">
        {sports.map((sport) => (
          <div
            key={sport.name}
            className="rounded-lg border p-5"
          >
            <h3 className="mb-3 text-xl font-bold">
              {sport.name}
            </h3>

            <div className="flex flex-col gap-2">
              {sport.links.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="rounded border p-3 hover:bg-slate-100"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg border p-5">
        <h2 className="mb-4 text-2xl font-bold">
          Standalone Graphics
        </h2>

        <div className="flex flex-col gap-2">
          {standalone.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="rounded border p-3 hover:bg-slate-100"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}