import '@types/react';

declare module 'react' {
  interface ReactNode {
    [key: string]: any;
  }
}