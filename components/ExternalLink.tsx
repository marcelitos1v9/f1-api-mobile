import { Link } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { Platform } from 'react-native';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string };

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      {...rest}
      href={href}
      onPress={async (event) => {
        if (Platform.OS !== 'web') {
          event.preventDefault(); // Previne o comportamento padrão
          await openBrowserAsync(href); // Abre no navegador
        }
      }}
      target="_blank" // Aqui você pode definir o target para abrir em nova aba
    />
  );
}
