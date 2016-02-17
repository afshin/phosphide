/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import {
  IAppShell, ICommandPalette, IShortcutManager, ICommandRegistry
} from 'phosphide';

import {
  Container, Token
} from 'phosphor-di';


export
function resolve(container: Container): Promise<void> {
  return container.resolve(Application).catch(error => {
    console.warn('Application instance failed to load:', error);
  });
}

/**
 * Application injects the UI chrome (palette, menus, etc.) into an `IAppShell`.
 */
class Application {

  static requires: Token<any>[] = [IAppShell, ICommandPalette, ICommandRegistry, IShortcutManager];

  static create(shell: IAppShell, palette: ICommandPalette, registry: ICommandRegistry, shortcuts: IShortcutManager): Application {
    return new Application(shell, palette, registry, shortcuts);
  }

  constructor(shell: IAppShell, palette: ICommandPalette, registry: ICommandRegistry, shortcuts: IShortcutManager) {
    palette.widget.title.text = 'Commands';
    palette.widget.id = 'command-palette';
    shell.addToLeftArea(palette.widget, { rank: 40 });
    shell.sideBarChanged.connect((sender: any, side: string) => {
      if (side !== 'left') {
        return;
      }
      if (document.body.dataset['leftArea'] === palette.widget.id) {
        registry.execute('command-palette:focus-input');
      }
    });

    shell.attach(document.body);
    window.addEventListener('resize', () => { shell.update(); });
  }
}
