export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Mufti Pay",
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
      href: "mailto:support@muftipay.com",
    },
    {
      label: "Logout",
      href: "/auth/logout",
    },
  ],
  links: {
    github: "https://muftipay.com",
    twitter: "https://x.com/muftipay",
  },
};
