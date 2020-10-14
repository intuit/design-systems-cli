export interface DisplayNamed {
  /** The name various dev tools should use to display the component */
  displayName?: string;
}

/**
 * Set a displayName on a component. This name is used in various dev tools.
 *
 * @param comp - The component to set the display name on
 * @param name - The display name for the component
 *
 * @example
 * displayName(Component, 'MyCoolComponent');
 */
export const displayName = <T extends React.ComponentType>(comp: T, name: string) => {
  const newComp: T & DisplayNamed = comp;
  newComp.displayName = name;

  return newComp;
};
