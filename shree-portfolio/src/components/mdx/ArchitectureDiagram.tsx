import { Fragment, type ReactNode } from 'react';

type DiagramKind = 'faultlab' | 'cordon' | 'trading';

function Node({ title, children, conditional = false }: {
  title: string;
  children: ReactNode;
  conditional?: boolean;
}) {
  return (
    <div className={`min-w-0 flex-1 rounded-lg border bg-background p-4 ${conditional ? 'border-dashed border-muted-foreground/60' : 'border-border'}`}>
      <div className="mb-2 text-sm font-semibold leading-snug text-foreground">{title}</div>
      <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

function Arrow({ label, across = false }: { label?: string; across?: boolean }) {
  return (
    <div className={`flex shrink-0 items-center justify-center gap-2 py-2 text-xs leading-relaxed text-muted-foreground ${across ? 'md:flex-col md:px-2' : ''}`}>
      <span aria-hidden="true" className={across ? 'md:hidden' : ''}>↓</span>
      {across && <span aria-hidden="true" className="hidden md:block">→</span>}
      {label && <span>{label}</span>}
    </div>
  );
}

function Flow({ children }: { children: ReactNode[] }) {
  return (
    <div className="flex flex-col md:flex-row md:items-stretch">
      {children.map((child, index) => (
        <Fragment key={index}>
          {index > 0 && <Arrow across />}
          {child}
        </Fragment>
      ))}
    </div>
  );
}

function FaultLabFlow() {
  return (
    <>
      <div className="mb-4 rounded-lg border border-accent-color/35 bg-accent-color/5 p-4 text-sm leading-relaxed">
        Actor runs fresh shop worlds. The fixed-code Referee grades against private simulator truth throughout.
      </div>
      <Flow>
        {[
          <div key="diagnose" className="min-w-0 flex-1 rounded-lg border border-border p-2">
            <div className="mb-3 px-2 pt-2 text-xs font-semibold">Diagnose</div>
            <Node title="01 · Reproduce & reduce">Find the smallest fault recipe that still reproduces the failure.</Node>
            <Arrow />
            <Node title="02 · Controlled diagnosis">Test the explanation with a controlled experiment.</Node>
          </div>,
          <div key="propose" className="min-w-0 flex-1 rounded-lg border border-border p-2">
            <div className="mb-3 px-2 pt-2 text-xs font-semibold">Propose</div>
            <Node title="03 · Mechanic proposes">Build a bounded recovery hook from recorded evidence.</Node>
            <Arrow />
            <Node title="04 · Source validation">Check the candidate against the original failure.</Node>
          </div>,
          <div key="challenge" className="min-w-0 flex-1 rounded-lg border border-border p-2">
            <div className="mb-3 px-2 pt-2 text-xs font-semibold">Challenge</div>
            <Node title="05 · Explorer challenge">Try to break the candidate with other fault schedules.</Node>
            <Arrow />
            <Node title="06 · Promotion decision">A separate gate decides whether a candidate may replace the active policy.</Node>
          </div>,
        ]}
      </Flow>
      <Arrow label="A pass at one stage is not promotion" />
      <Node title="Failed or incomplete evidence → retain baseline">
        A failed challenge, lab error or scheduled fault that never fired does not activate a repair.
      </Node>
    </>
  );
}

function CordonFlow() {
  return (
    <>
      <Node title="Untrusted input">Email or web content with a configured source trust label.</Node>
      <Arrow />
      <div className="rounded-lg border border-accent-color/45 bg-accent-color/5 p-4">
        <div className="mb-4 text-xs font-semibold text-foreground">ToolProxy reference monitor</div>
        <Flow>
          {[
            <Node key="read" title="Instrumented tool read">Mark the caller exposed because of the source.</Node>,
            <Node key="handoff" title="Agent handoffs">Propagate taint; record sender exposure at handoff time.</Node>,
          ]}
        </Flow>
        <Arrow />
        <Node title="Credential broker">Check taint and requested scope before retrieving a secret.</Node>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Arrow label="Denied: tainted + sensitive" />
          <div className="rounded-lg border border-accent-color/45 bg-accent-color/5 p-4">
            <div className="mb-3 text-xs font-semibold">ToolProxy containment</div>
            <Node title="Contact tracing / quarantine">
              Trace the origin and exposed descendants. Deny further broker requests and ask the sandbox to freeze affected agents.
            </Node>
            <div className="mt-3 text-xs leading-relaxed text-muted-foreground">The denied path never calls the secret resolver. Unaffected agents can continue.</div>
          </div>
        </div>
        <div>
          <Arrow label="Allowed request only" />
          <Node title="External secret resolver" conditional>Retrieve the requested credential only after the broker permits access.</Node>
        </div>
      </div>
      <div className="mt-4 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">Signed, hash-chained audit events support inspection and replay.</div>
    </>
  );
}

function TradingFlow() {
  return (
    <>
      <Flow>
        {[
          <Node key="intent" title="Strategy intent">A strategy decision requests an effect; it is not yet a broker order.</Node>,
          <Node key="checks" title="Execution checks">Permission, operator state, unresolved orders and data health. Entry and exit use different check sets.</Node>,
          <Node key="broker" title="Broker adapter" conditional>Conditional live path: submit only when checks and execution permission allow it.</Node>,
        ]}
      </Flow>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border p-4">
          <div className="mb-3 text-xs leading-relaxed text-muted-foreground">Checks refuse → record the reason</div>
          <Node title="Append-only event log">Decisions, refusals and execution results share one JSONL record.</Node>
          <Arrow />
          <Node title="Dashboard / replay / recovery">Read complete records. Replay has no broker effects; operator controls use a separate channel.</Node>
        </div>
        <div className="rounded-lg border border-dashed border-muted-foreground/60 p-4">
          <div className="mb-3 text-xs leading-relaxed text-muted-foreground">Broker response ambiguous → reconcile</div>
          <Node title="UNKNOWN / reconcile" conditional>Read the broker order book and match the order tag. Record the outcome in the event log.</Node>
          <div className="mt-4 border-t border-border pt-4 text-sm font-medium leading-relaxed">Hold new entries while unresolved. Do not blindly repeat writes.</div>
        </div>
      </div>
      <div className="mt-4 text-xs leading-relaxed text-muted-foreground">Dashed boxes show the documented broker and reconciliation paths.</div>
    </>
  );
}

// Diagram contracts are reviewed against the canonical FaultLab/CORDON corpus
// and the public refuses-to-trade architecture and decision records. They show
// control flow, not successful live operation or project-wide validation.
const diagrams = {
  faultlab: {
    title: 'How a candidate repair reaches the promotion gate',
    caption: 'Recorded continuation through September 30, 2026: no generated policy was accepted; policy-v0 remained active. Historical evidence imports are a separate review workflow.',
    Flow: FaultLabFlow,
  },
  cordon: {
    title: 'Exposure travels; credential authority stays at the broker',
    caption: 'Illustrative path through instrumented interfaces. Exposure is provenance, not a content-classifier verdict. Broker denial is not vault-token revocation; a requested sandbox freeze is not proof of isolation.',
    Flow: CordonFlow,
  },
  trading: {
    title: 'An intent must earn permission to become an order',
    caption: 'Documented architecture. Historical observe/paper records had live execution disabled and no broker submissions. The broker and ambiguity branches are design paths, not recorded submissions.',
    Flow: TradingFlow,
  },
} satisfies Record<DiagramKind, { title: string; caption: string; Flow: () => ReactNode }>;

/** Server-rendered text remains readable and selectable at every viewport. */
export function ArchitectureDiagram({ kind }: { kind: DiagramKind }) {
  const { title, caption, Flow: DiagramFlow } = diagrams[kind];
  const id = `architecture-${kind}`;
  return (
    <figure aria-labelledby={`${id}-title`} aria-describedby={`${id}-caption`} className="my-8 rounded-xl border border-border bg-muted/15 p-4 sm:p-5">
      <div id={`${id}-title`} className="mb-5 text-base font-semibold leading-relaxed">{title}</div>
      <DiagramFlow />
      <figcaption id={`${id}-caption`} className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">{caption}</figcaption>
    </figure>
  );
}
