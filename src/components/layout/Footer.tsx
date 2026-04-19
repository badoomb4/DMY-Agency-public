import { Container, Group, Text, Anchor, Stack, Divider } from "@mantine/core";
import { MantineProvider } from "../MantineProvider";

const footerLinks = [
  {
    title: "Services",
    links: [
      { label: "Développement", href: "/services" },
      { label: "Conseil IA", href: "/services#conseil-ia" },
      { label: "Automatisation", href: "/services#automatisation" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { label: "Contact", href: "/#contact" },
      { label: "Mentions légales", href: "/mentions-legales" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { label: "FAQ", href: "/#faq" },
    ],
  },
];

export function Footer() {
  return (
    <MantineProvider>
    <footer style={{ background: "#171717", borderTop: "1px solid #2a2a2a" }}>
      <Container size="xl" py={60}>
        <Group align="flex-start" justify="space-between" wrap="wrap" gap={40}>
          <Stack gap="xs" style={{ maxWidth: 250 }}>
            <Text fw={700} fz="md" c="#f5f5f5" style={{ letterSpacing: "-0.3px" }}>
              DMY
            </Text>
            <Text fz="sm" c="#737373">
              Services informatiques vitaminés à l'IA.
            </Text>
          </Stack>

          {footerLinks.map((group) => (
            <Stack key={group.title} gap="xs">
              <Text fw={600} fz="xs" c="#a3a3a3" style={{ textTransform: "uppercase", letterSpacing: "1px" }}>
                {group.title}
              </Text>
              {group.links.map((link) => (
                <Anchor key={link.label} href={link.href} c="#737373" fz="sm" underline="never">
                  {link.label}
                </Anchor>
              ))}
            </Stack>
          ))}
        </Group>

        <Divider my="xl" color="#2a2a2a" />

        <Text fz="xs" c="#525252" ta="center">
          © {new Date().getFullYear()} DMY. Tous droits réservés.
        </Text>
      </Container>
    </footer>
    </MantineProvider>
  );
}
