export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Data Padi",
  description: "A mobile-first VTU and recharge card printing application featuring a modern, minimalistic design and smooth interactions.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Dashboard",
      href: "/user/dashboard",
    },
    {
      label: "Pricing",
      href: "/#pricing",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/user/profile",
    },
    {
      label: "Dashboard",
      href: "/user/dashboard",
    },
    {
      label: "Settings",
      href: "/user/profile",
    },
    {
      label: "Help & Feedback",
      href: "mailto:support@datapadi.com",
    },
    {
      label: "Logout",
      href: "/auth/logout",
    },
  ],
  links: {
    github: "https://datapadi.com",
    twitter: "https://x.com/datapadi",
  },
};
