import { Award } from 'lucide-react'
import { ModuleNotice, Page, Panel } from '@/components/layout/PageHeader'
import { REWARDS } from '@/content/original'

/**
 * The Reward System is under construction in the product. This page states
 * that plainly and shows no balances, rules or rewards that don't exist yet.
 */
export default function RewardsPage() {
  return (
    <Page title={REWARDS.title} subtitle={REWARDS.subtitle}>
      <Panel label={REWARDS.title} fill>
        <ModuleNotice icon={<Award aria-hidden className="size-5" />} title={REWARDS.notice.title} body={REWARDS.notice.body} status={REWARDS.notice.status} />
      </Panel>
    </Page>
  )
}
