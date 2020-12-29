// addEventListener<K extends keyof WindowEventMap>
// (type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;

// export interface Binding <K extends keyof WindowEventMap>{
//   eventName: K;
//   fn: (this: Window, ev: WindowEventMap[K]) => any;
//   options?: boolean | AddEventListenerOptions
// }
export interface Binding {
  eventName: string;
  fn: (e: MouseEvent) => any;
  options?: AddEventListenerOptions;
}
