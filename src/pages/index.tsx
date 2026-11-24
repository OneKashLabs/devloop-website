import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

const REPO = 'https://github.com/OneKashLabs/devloop';
const EXAMPLES = `${REPO}/tree/main/examples`;

// Commands and agents show as code; the checkpoints are plain headings.
type Step = {name: string; does: string; code?: boolean};

const LOOP: Step[] = [
  {name: '/spec', code: true, does: 'Clarify what to build: user stories and acceptance criteria. Or check an existing design doc.'},
  {name: '/plan', code: true, does: 'Plan how to build it: chunks, dependencies and a JSON tracker. A bug fix starts with a proof: a failing test or a probe.'},
  {name: 'review-plan', code: true, does: 'An independent agent reviews the plan. Review, fix and re-review run unattended, up to 3 rounds by default.'},
  {name: 'Checkpoint 1', does: 'You approve the reviewed plan and every decision it made.'},
  {name: '/implement', code: true, does: 'Build it with TDD, chunk by chunk: a failing test, the code, a passing test.'},
  {name: 'review-impl', code: true, does: 'An independent agent reviews the diff through conformance, correctness and cleanup lenses.'},
  {name: 'Checkpoint 2', does: 'You approve the findings and fixes. Then the finish steps run.'},
];

type Tile = {title: string; body: string};

const WHY: Tile[] = [
  {title: 'One pass decides everything', body: 'What to build, how, and the code come out at once. A misread requirement is written as code, where it costs the most to undo.'},
  {title: 'The author grades its own work', body: '“I verified it works,” from the context that wrote the code, is a self-report.'},
  {title: 'Long sessions lose the plan', body: 'A long session degrades and a resumed one starts cold, so the plan and the reasoning behind it are lost.'},
  {title: 'No hard gate', body: 'An agent can report “done” without a test that proves it.'},
  {title: 'Prompts don’t persist', body: 'They live in your head and drift from run to run and project to project.'},
];

const LENSES: Tile[] = [
  {title: 'Conformance', body: 'The change does what the plan says. Each acceptance criterion is confirmed by a quoted test, plausible (code, no test), or refuted.'},
  {
    title: 'Correctness, 5 angles',
    body: 'Line-by-line diff scan, removed-behavior auditor, cross-file caller and callee tracer, language-pitfall specialist, wrapper and proxy correctness.',
  },
  {
    title: 'Cleanup, 5 angles',
    body: 'Reuse, simplification, efficiency, altitude, and maintainability: stale docs, hard-coded environment values, dependency and versioning rules, error messages.',
  },
  {
    title: 'Conventions, in every lens',
    body: 'Reads your CLAUDE.md or AGENTS.md and .devloop/config.md, and flags only rules it can quote. A violation with a real fault fails the gate like a bug.',
  },
];

const CHECKS: string[] = [
  'The correctness lens lists every candidate defect, then a verify pass keeps the CONFIRMED and PLAUSIBLE ones.',
  'Each finding says whether the change introduced it. A pre-existing bug is reported and never fails the gate on its own.',
  'Each report ends with one JSON list of findings.',
  'A small diff gets one reviewer with every lens; a larger one gets one agent per lens.',
];

const DEVLOOP_DIR = `.devloop/
  config.md    # build, test and lint commands, architecture, standards,
               #   blindspots, commit conventions, spec and tracker folders
  domain.md    # domain context and domain-specific concerns, read by /spec
  trackers/    # impl-tracker-<feature>.json, written by /plan`;

const AUTONOMY = `## Autonomy

- Review rounds: 3
- Convergence: auto
- Finish steps:
  1. Run the full test suite and lint
  2. Commit (see Commit Conventions)
- Stop and ask on: anything that publishes outside this repository`;

function Hero(): ReactNode {
  return (
    <header className="dl-hero">
      <div className="container dl-hero__inner">
        <div>
          <Heading as="h1" className="dl-hero__title">
            Spec, plan and build, with independent review.
          </Heading>
          <p className="dl-hero__lead">
            A test-driven development loop for Claude Code and Codex. Review agents check the plan before coding
            and the diff before commit.
          </p>
          <div className="dl-hero__cta">
            <Link className="dl-btn dl-btn--accent" to="/#install">
              Install
            </Link>
            <Link className="dl-btn dl-btn--line" href={REPO}>
              View on GitHub
            </Link>
          </div>
          <p className="dl-hero__note">Free and open source. Markdown skills and agents, no runtime.</p>
        </div>
        <div className="dl-hero__art">
          <img className="dl-hero__kash" src={useBaseUrl('/img/kash/kash-reading.webp')} alt="" width={480} height={458} />
          <img className="dl-hero__paws" src={useBaseUrl('/img/kash/kash-paws.webp')} alt="" width={720} height={176} />
          <div className="dl-hero__term">
            <div className="dl-term__bar" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <CodeBlock language="text">/plugin marketplace add OneKashLabs/devloop</CodeBlock>
            <CodeBlock language="text">/plugin install devloop@onekashlabs</CodeBlock>
            <p className="dl-term__or">In Claude Code. Codex steps are below.</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function Statement(): ReactNode {
  return (
    <section className="dl-statement">
      <div className="container">
        <Heading as="h2">Reviewed by agents that didn’t write the code.</Heading>
        <p>
          The plan review and the code review run in a context that did not write the plan or the code. You approve
          the result at two checkpoints.
        </p>
      </div>
    </section>
  );
}

function Loop(): ReactNode {
  return (
    <section className="dl-section">
      <div className="container">
        <Heading as="h2" className="dl-heading" id="loop">
          How the loop works
        </Heading>
        <ol className="dl-steps">
          {LOOP.map((s) => (
            <li key={s.name}>
              <Heading as="h3">{s.code ? <code>{s.name}</code> : s.name}</Heading>
              <p>{s.does}</p>
            </li>
          ))}
        </ol>
        <div className="dl-tiles">
          <div className="dl-tile">
            <Heading as="h3">Small fixes take the fast lane</Heading>
            <p>
              One production file plus its tests, with no new behavior beyond the fix, skips the tracker: the failing
              test, the fix, then the code review. <code>/plan</code> checks the size and takes it itself.
            </p>
          </div>
          <div className="dl-tile">
            <Heading as="h3">A wrong plan gets corrected</Heading>
            <p>
              If a code-review finding shows the plan was wrong, <code>/implement</code> adds corrective chunks, has
              them reviewed and builds them, without asking by default. A finding that the spec was wrong always comes
              to you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Why(): ReactNode {
  return (
    <section className="dl-section dl-section--mist">
      <div className="container">
        <Heading as="h2" className="dl-heading">
          Why not a single prompt?
        </Heading>
        <p className="dl-lead">
          A coding agent can build a feature from one prompt. One prompt doesn’t give you the steps around the code.
        </p>
        <div className="dl-tiles">
          {WHY.map((t) => (
            <div className="dl-tile" key={t.title}>
              <Heading as="h3">{t.title}</Heading>
              <p>{t.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Review(): ReactNode {
  return (
    <section className="dl-section">
      <div className="container">
        <Heading as="h2" className="dl-heading" id="review">
          The code review: three lenses
        </Heading>
        <p className="dl-lead">
          <code>review-impl</code> reads the diff in a fresh context, read-only. Both reviews use one list of six
          concerns: does the change do what was asked, does it hold up, and can it be maintained.
        </p>
        <div className="dl-tiles">
          {LENSES.map((t) => (
            <div className="dl-tile" key={t.title}>
              <Heading as="h3">{t.title}</Heading>
              <p>{t.body}</p>
            </div>
          ))}
        </div>
        <ul className="dl-checks">
          {CHECKS.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <p className="dl-more">
          To review a diff with no plan, such as a hotfix or someone else’s branch, give <code>review-impl</code> the
          diff range and say there is no tracker.
        </p>
      </div>
    </section>
  );
}

function Install(): ReactNode {
  return (
    <section className="dl-section dl-section--mist">
      <div className="container">
        <Heading as="h2" className="dl-heading" id="install">
          Install
        </Heading>
        <ol className="dl-steps">
          <li>
            <Heading as="h3">Add the plugin</Heading>
            <Tabs groupId="install">
              <TabItem value="claude" label="Claude Code" default>
                <CodeBlock language="text">{'/plugin marketplace add OneKashLabs/devloop\n/plugin install devloop@onekashlabs'}</CodeBlock>
                <p className="dl-small">Claude Code finds the three skills and the two review agents.</p>
              </TabItem>
              <TabItem value="codex" label="Codex">
                <CodeBlock language="bash">{'codex plugin marketplace add OneKashLabs/devloop\ncodex plugin add devloop@onekashlabs'}</CodeBlock>
                <p className="dl-small">
                  A Codex plugin carries skills, not agents, so the review agents ship as prompt files. The skills
                  spawn them as subagents where Codex supports delegation, and otherwise fall back to an in-context
                  self-check.
                </p>
              </TabItem>
              <TabItem value="other" label="Other clients">
                <p>
                  The repo root carries a <code>plugin.json</code> in the{' '}
                  <Link href="https://agent-plugins.org">Agent Plugins</Link> 1.0.0 format, so the skills install on
                  clients that support the standard. Clients that support subagent delegation get the isolated review;
                  the rest fall back to the self-check.
                </p>
              </TabItem>
            </Tabs>
          </li>
          <li>
            <Heading as="h3">Give the loop your project’s context</Heading>
            <p>
              Put a <code>.devloop/</code> folder at your project root. The fastest start is to copy the closest{' '}
              <Link href={EXAMPLES}>stack example</Link> (TypeScript and Node, Python, Rust, Android and Kotlin) and
              adapt it.
            </p>
            <CodeBlock language="text">{DEVLOOP_DIR}</CodeBlock>
            <p>
              Commit <code>config.md</code> and <code>domain.md</code> so the team shares one context. Without{' '}
              <code>.devloop/</code> the loop still runs, with less insight into your project.
            </p>
          </li>
          <li>
            <Heading as="h3">Start with a command</Heading>
            <p>
              Run <code>/spec</code>, <code>/plan</code> or <code>/implement</code> with your feature. You start each
              command yourself.
            </p>
          </li>
        </ol>
      </div>
    </section>
  );
}

function Autonomy(): ReactNode {
  return (
    <section className="dl-section">
      <div className="container">
        <Heading as="h2" className="dl-heading" id="autonomy">
          Choose how much it does without asking
        </Heading>
        <p className="dl-lead">
          An optional <code>## Autonomy</code> section in <code>config.md</code> tunes the stretches between the two
          checkpoints: review rounds per gate (default 3), whether plan corrections run on their own, the finish steps
          after the second checkpoint (default none), and extra stop conditions.
        </p>
        <div className="dl-code">
          <CodeBlock language="markdown">{AUTONOMY}</CodeBlock>
        </div>
        <p className="dl-more">
          The config can also list pre-review checks, a verify recipe that runs the change end to end before the
          second checkpoint, and what happens to a finished tracker. See the{' '}
          <Link href={`${REPO}#readme`}>full reference</Link>.
        </p>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Spec, plan and build, with independent review"
      description="A test-driven development loop for Claude Code and Codex, with review agents that check the plan before coding and the diff before commit.">
      <Hero />
      <main>
        <Statement />
        <Loop />
        <Why />
        <Review />
        <Install />
        <Autonomy />
      </main>
    </Layout>
  );
}
