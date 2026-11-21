import { appNavItems } from "@/components/appNavItems";
import { TabBar } from "@/components/TabBar";

export function AppTabBar() {
  return <TabBar items={appNavItems} className="sticky bottom-0 md:rounded-b-lg desktop:hidden" />;
}
