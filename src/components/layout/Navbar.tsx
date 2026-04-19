import { Group, Button, Text, Container, Anchor } from "@mantine/core";
import { MantineProvider } from "../MantineProvider";

const links = [
  { label: "Services", href: "/#services" },
  { label: "Process", href: "/#process" },
  { label: "Tarifs", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

export function Navbar() {
  return (
    <MantineProvider>
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 101,
        background: "#ffffff",
        borderBottom: "1px solid #ededed",
      }}
    >
      <Container size="xl" py={12}>
        <Group justify="space-between">
          <Text
            fw={700}
            fz="md"
            c="#262626"
            style={{ letterSpacing: "-0.3px" }}
          >
            DMY
          </Text>

          <Group gap="xl" visibleFrom="sm">
            {links.map((link) => (
              <Anchor
                key={link.href}
                href={link.href}
                c="#737373"
                fz="sm"
                fw={500}
                underline="never"
                style={{
                  transition: "color 150ms",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#262626")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#737373")}
              >
                {link.label}
              </Anchor>
            ))}
          </Group>

          <Group gap="sm">
            <Button
              component="a"
              href="#contact"
              variant="subtle"
              color="gray"
              c="#262626"
              size="sm"
              radius="md"
              fw={500}
            >
              Contact
            </Button>
            <Button
              component="a"
              href="#contact"
              color="#262626"
              size="sm"
              radius="md"
              fw={500}
            >
              Démarrer →
            </Button>
          </Group>
        </Group>
      </Container>
    </nav>
    </MantineProvider>
  );
}
