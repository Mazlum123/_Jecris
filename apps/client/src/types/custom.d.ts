import { ReactNode } from 'react';

declare module 'react' {
  interface ReactElement {
    children?: ReactNode;
  }
}

declare module 'react-router-dom' {
  interface RouteObject {
    element?: React.ReactNode;
  }
}