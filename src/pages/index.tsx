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

// Who acts at each step: a command you run, an agent that reviews in a fresh context, or you.
type Kind = 'run' | 'agent' | 'you';
type Node = {name: string; kind: Kind; does: string};

const PLAN_ROW: Node[] = [
  {name: '/spec', kind: 'run', does: 'What to build: user stories and acceptance criteria.'},
  {name: '/plan', kind: 'run', does: 'How: chunks, dependencies and a JSON tracker. A bug fix starts with a proof.'},
  {name: 'review-plan', kind: 'agent', does: 'Reviews the plan, up to 3 rounds by default.'},
  {name: 'You approve', kind: 'you', does: 'The reviewed plan and every decision it made.'},
];

const BUILD_ROW: Node[] = [
  {name: '/implement', kind: 'run', does: 'Builds each chunk test first: a failing test, the code, a passing test.'},
  {name: 'review-impl', kind: 'agent', does: 'Reviews the diff: conformance, correctness and cleanup.'},
  {name: 'You approve', kind: 'you', does: 'The findings and fixes. Then the finish steps run.'},
];

const KIND_LABEL: Record<Kind, string> = {run: 'You run', agent: 'Independent agent', you: 'Checkpoint'};

type Tile = {title: string; body: string};

type Row = {problem: string; prompt: string; devloop: string};

const WHY: Row[] = [
  {problem: 'Deciding what to build', prompt: 'Requirements and design get settled while the code is being written.', devloop: '/spec and /plan settle them first, and you approve the reviewed plan before any code.'},
  {problem: 'Checking the work', prompt: 'The session that wrote the code also reviews it.', devloop: 'The plan and the code are reviewed in a context that didn’t write them.'},
  {problem: 'Keeping the plan', prompt: 'The plan lives in the conversation, and compaction or a new session loses detail.', devloop: 'The plan lives in a tracker file that survives a reset.'},
  {problem: 'Proving it works', prompt: '“Done” can arrive without a test for each requirement.', devloop: 'Chunks with logic start from a failing test, and the review checks each criterion against a test.'},
  {problem: 'Repeating the process', prompt: 'You ask for tests first, a review and a pause before commit, again each session.', devloop: 'The process is built in, and an Autonomy section sets how much runs without asking.'},
];

const LENSES: Tile[] = [
  {title: 'Conformance', body: 'The change does what the plan says. Each acceptance criterion is confirmed by a quoted test, plausible (code, no test), or refuted.'},
  {
    title: 'Correctness, 5 angles',
    body: 'Reads every changed line, checks what removed code used to guarantee, follows callers and callees, and looks for language pitfalls and wrapper mistakes.',
  },
  {
    title: 'Cleanup, 5 angles',
    body: 'Reuse, simpler code, wasted work, whether a fix is at the right depth, and maintainability: stale docs, hard-coded environment values, dependency rules, error messages.',
  },
  {
    title: 'Conventions, in every lens',
    body: 'Reads your CLAUDE.md or AGENTS.md and .devloop/config.md, and flags only rules it can quote. A violation with a real fault fails the gate like a bug.',
  },
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
            A test-driven development plugin for Claude Code and Codex. Review agents check the plan before coding
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
            <pre className="dl-run" aria-label="An example devloop run">
              <span className="dl-run__cmd">/implement refund-cap</span>
              {'\n'}
              <span className="dl-run__dim">chunk 1  test fails, code, test passes</span>
              {'\n'}
              <span className="dl-run__dim">chunk 2  test fails, code, test passes</span>
              {'\n\n'}
              <span className="dl-run__agent">review-impl</span> <span className="dl-run__fail">FAIL</span>, 1 finding
              {'\n'}
              {'  correctness, confirmed, refunds.py:12'}
              {'\n'}
              <span className="dl-run__dim">{'  a second refund can exceed the order total'}</span>
              {'\n\n'}
              <span className="dl-run__dim">fixed, test added, re-reviewed</span>
              {'\n'}
              <span className="dl-run__agent">review-impl</span> <span className="dl-run__pass">PASS</span>
              {'\n\n'}
              <span className="dl-run__you">Checkpoint 2: approve the findings and fixes?</span>
            </pre>
            <p className="dl-term__or">
              An example run. <Link to="/#install">Install steps</Link> are below.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

function NodeCard({n}: {n: Node}): ReactNode {
  return (
    <li className={`dl-node dl-node--${n.kind}`}>
      <span className="dl-node__kind">{KIND_LABEL[n.kind]}</span>
      <Heading as="h3">{n.kind === 'you' ? n.name : <code>{n.name}</code>}</Heading>
      <p>{n.does}</p>
    </li>
  );
}

function Loop(): ReactNode {
  return (
    <section className="dl-section dl-section--ink">
      <div className="container">
        <Heading as="h2" className="dl-heading" id="loop">
          How the loop works
        </Heading>
        <div className="dl-loop">
          <ol className="dl-track">
            {PLAN_ROW.map((n, i) => (
              <NodeCard n={n} key={`p${i}`} />
            ))}
          </ol>
          <div className="dl-back" aria-hidden="true">
            <svg viewBox="0 0 400 56" preserveAspectRatio="none">
              <defs>
                <marker id="dl-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0 0 L10 5 L0 10 z" />
                </marker>
              </defs>
              <path d="M150 56 V28 H250 V3" markerEnd="url(#dl-arrow)" />
            </svg>
            <span>a finding shows the plan was wrong</span>
          </div>
          <ol className="dl-track dl-track--build">
            {BUILD_ROW.map((n, i) => (
              <NodeCard n={n} key={`b${i}`} />
            ))}
          </ol>
        </div>
        <p className="dl-more">
          When a code-review finding shows the plan was wrong, /implement adds corrective chunks, has them reviewed
          and builds them, without asking by default. A finding that the spec was wrong always comes to you. Small
          fixes take the fast lane: one production file plus its tests, with no new behavior beyond the fix, skips the
          tracker and goes straight to the code review.
        </p>
      </div>
    </section>
  );
}

function Why(): ReactNode {
  return (
    <section className="dl-section dl-section--mist">
      <div className="container">
        <Heading as="h2" className="dl-heading">
          Ad-hoc prompting vs devloop
        </Heading>
        <table className="dl-compare">
          <thead>
            <tr>
              <th scope="col" />
              <th scope="col">Ad-hoc prompting</th>
              <th scope="col">With devloop</th>
            </tr>
          </thead>
          <tbody>
            {WHY.map((w) => (
              <tr key={w.problem}>
                <th scope="row">{w.problem}</th>
                <td>{w.prompt}</td>
                <td>{w.devloop}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
          <code>review-impl</code> reads the diff in a fresh context and changes nothing. Both reviews check the same
          six concerns.
        </p>
        <div className="dl-tiles">
          {LENSES.map((t) => (
            <div className="dl-tile" key={t.title}>
              <Heading as="h3">{t.title}</Heading>
              <p>{t.body}</p>
            </div>
          ))}
        </div>
        <p className="dl-more">
          Each finding is checked against the code before it is reported, and says whether this change introduced it.
          A bug that was already there is reported but doesn’t fail the review. To review a diff with no plan, give
          review-impl the diff range.
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
      title="A test-driven plugin for Claude Code and Codex"
      description="A test-driven development plugin for Claude Code and Codex, with review agents that check the plan before coding and the diff before commit.">
      <Hero />
      <main>
        <Loop />
        <Why />
        <Review />
        <Install />
        <Autonomy />
      </main>
    </Layout>
  );
}
