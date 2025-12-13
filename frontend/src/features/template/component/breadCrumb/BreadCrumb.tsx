"use client";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface BreadcrumbTitleProps {
  title?: string;
}

// Map paths to their redirect destinations
const BREADCRUMB_ROUTES = new Map([
  ["/users", "/users/list"],
  ["/users/roles", "/users/roles"],
  ["/users/permissions", "/users/permissions"],
  ["/users/roles/new", "/users/roles/new"],
  ["/dashboard", "/dashboard"],
]);

const isInBreadcrumbRoutes = (path: string) => {
  return BREADCRUMB_ROUTES.has(path);
};

const getBreadcrumbRoute = (path: string) => {
  return BREADCRUMB_ROUTES.get(path);
};

// Convert "User Profile" → "user-profile"
const toPath = (label: string) =>
  label.toLowerCase().replace(/\s+/g, "-");

export function BreadcrumbTitle({ title }: BreadcrumbTitleProps) {
  const router = useRouter();

  const breadcrumbs = title?.split(" > ") ?? [];

  if (breadcrumbs.length === 0) return null;

  return (
    <nav className="flex items-center gap-1 text-lg font-semibold">
      {breadcrumbs.map((crumb, index) => {
        const href =
          "/" +
          breadcrumbs
            .slice(0, index + 1)
            .map(toPath)
            .join("/");

        const isLast = index === breadcrumbs.length - 1;

        return (
          <div key={crumb} className="flex items-center gap-1">
            {!isLast ? (
              <button
                disabled={!isInBreadcrumbRoutes(href)}
                onClick={() => router.push(getBreadcrumbRoute(href) || "")}
                className={`text-primary ${!isInBreadcrumbRoutes(href) ? "" : "hover:underline"}`}
              >
                {crumb}
              </button>
            ) : (
              <span className="text-muted-foreground">{crumb}</span>
            )}

            {!isLast && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        );
      })}
    </nav>
  );
}