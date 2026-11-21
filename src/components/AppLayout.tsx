import { Link, NavLink, Outlet, ScrollRestoration, useLocation } from "react-router";

import { appNavItems } from "@/components/appNavItems";
import { LogoMark } from "@/components/icons";
import { useStore } from "@/hooks/useStore";
import { useStoreId } from "@/hooks/useStoreId";
import { cn } from "@/utils/cn";

export function AppLayout() {
  const { pathname, search } = useLocation();
  const storeId = useStoreId();
  const { data: store } = useStore(storeId);
  const receiptSection =
    new URLSearchParams(search).get("returnTo") === "/home" ? "/home" : "/ingredients";

  return (
    <div className="min-h-dvh desktop:grid desktop:grid-cols-[282px_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh flex-col gap-5 overflow-y-auto border-r-2 border-border-divider bg-button-surface-1 px-5 py-10 desktop:flex">
        <Link
          to="/home"
          className="flex w-fit items-center gap-2 rounded-sm text-wordmark outline-none focus-visible:ring-4 focus-visible:ring-button-primary/20"
        >
          <LogoMark size={32} aria-hidden />
          발주바주
        </Link>

        {store && <p className="text-label-l font-semibold wrap-anywhere">{store.name}</p>}

        <nav aria-label="주 메뉴" className="grid gap-2">
          {appNavItems.map(({ to, label, icon: Icon }) => {
            const isReceiptSection = pathname === "/receipt" && to === receiptSection;
            return (
              <NavLink
                key={to}
                to={to}
                aria-current={isReceiptSection ? "location" : undefined}
                className={({ isActive }) =>
                  cn(
                    "flex min-h-11 items-center gap-3 rounded-md px-4 py-2 text-label-s outline-none focus-visible:ring-4 focus-visible:ring-button-primary/30",
                    isActive || isReceiptSection
                      ? "bg-button-primary text-text-white"
                      : "text-text-gray-darker hover:bg-bg-hover",
                  )
                }
              >
                <Icon size={20} aria-hidden />
                {label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0">
        <Outlet />
      </div>

      <ScrollRestoration getKey={({ pathname }) => pathname} />
    </div>
  );
}
