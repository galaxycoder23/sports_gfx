const sports = [
  {
    name: 'General',
    links: [
      ['Lower Third', '/lt'],
      ['Graph', '/graph'],
      ['Score', '/score'],
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
      ['Score', '/score_american_football'],
    ],
  },
  {
    name: 'Boxing',
    links: [['Score', '/score_boxing']],
  },
    {
    name: 'Rugby',
    links: [['Score', '/score_rugby']],
  },
]

const controls = [
  ['Lower Third Control', '/lt_control'],
  ['Graph Control', '/graph_control'],
  ['Score Control', '/score_control'],
  ['Boxing Score Control', '/score_control_boxing'],
  ['American Football Score Control', '/score_control_american_football'],
  ['Rugby Score Control', '/score_control_rugby'],
]

export default function Landing() {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-8 text-4xl font-bold">
        Guild TV Sports Graphics
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
    </div>
  )
}