import { Page, Locator, expect } from '@playwright/test';

export type InputName = 'cuentaDestinoInput'  | 'montoInput';
export type ButtonName = 'enviarTransferenciaButton';
export type StatusText = 'estadoBox';

export const BASE_URL = 'http://localhost:5173';

/**
 * Page Object Model (POW) para Lite Bank Frontend
 * @page /
 */
export class RegistroPageLocators {
  readonly page: Page;

  // ============ Configuración ============

  private readonly CONFIG = {
    PAGE_PATH: '/',
    TIMEOUTS: {
      PAGE_LOAD: 10000,
      ELEMENT_VISIBLE: 2000,
      NAVIGATION: 30000
    }
  } as const;

  constructor(page: Page) {
    this.page = page;
  }

  // ============ Private Helpers ============

  /**
   * Valida si un elemento está visible en la página
   * @private
   */
  private async isVisible(locator: Locator, timeout = this.CONFIG.TIMEOUTS.ELEMENT_VISIBLE): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  // ============ Elementos del Formulario ============

  /**
   * Campo de texto Cuenta Destino (Ej: 98765)
   * @locator getByPlaceholder('Cuenta Destino (Ej: 98765)')
   * @example await page.cuentaDestinoEjInput.fill('value');
   */
  get cuentaDestinoInput(): Locator {
    //return this.page.getByPlaceholder('Cuenta Destino (Ej: 98765)');
    return this.page.getByRole('textbox', { name: 'Cuenta Destino (Ej: 98765)' });   
  }

  /**
   * Campo numerico Monto ($)
   * @locator getByPlaceholder('Monto ($)')
   * @example await page.montoInput.fill('value');
   */
  get montoInput(): Locator {
    return this.page.getByPlaceholder('Monto ($)');
    //return this.page.getByRole('textbox', { name: 'Monto ($)' });
  }

  /**
   * Botón Enviar Transferencia
   * @locator getByRole('button', { name: /Enviar Transferencia/i })
   * @example await page.enviarTransferenciaButton.click();
   */
  get enviarTransferenciaButton(): Locator {
    return this.page.getByRole('button', { name: 'Enviar Transferencia' });
  }

  /**
   * Etiqueta: Estado
   * @locator getByTestId('status-box')
   * @example await page.estadoBox.textContent();
   */
  get estadoBox(): Locator {
    return this.page.locator('#status-box');
  }   

  // ============ Navegación ============

  /**
   * Navegar a la página
   * @param baseUrl - Optional base URL override (defaults to env variable)
   * @example
   */
  async goto(baseUrl?: string): Promise<void> {
    const url = BASE_URL;
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }
}
