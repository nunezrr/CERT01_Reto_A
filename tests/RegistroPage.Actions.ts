import { expect, Locator, Page } from '@playwright/test';
import { BASE_URL, ButtonName, RegistroPageLocators } from './RegistroPage.Locators';
import { capture } from './Evidence';

// ============ Acciones ============
export class RegistroPageActions {
    private readonly locators: RegistroPageLocators;

    constructor(private readonly page: Page) {
        this.locators = new RegistroPageLocators(page);
    }

    // ============ Principal ============
    async open(): Promise<RegistroPageActions> {
        await this.page.goto(BASE_URL);
        return this;
    }

    // ============ Datos de la transferencia ============
    /**Llenar datos en el formulario de transferencia
     * @param cuentaDestino - Número de cuenta destino (Ej: 98765)
     * @param monto - Monto a transferir ($)
     * @example await page.DatosRegistro('98765', 100);      
     */
    async DatosRegistro(cuentaDestino: string, monto: string): Promise<void> {
        await this.locators.cuentaDestinoInput.fill(cuentaDestino);
        await this.locators.montoInput.fill(monto);
        await capture(this.page, 'Datos-registro-de-transferencia');
    }

    // ============ Envio de la transferencia ============
    /**Hacer click en un botón
     * @param buttonName - Nombre del botón a clicar
     * @example await page.clickButton('enviarTransferenciaButton');    
     */
    async clickButton(): Promise<void> {
        const buttonMap: Record<ButtonName, Locator> = {
        'enviarTransferenciaButton': this.locators.enviarTransferenciaButton,
        };
        const button = this.locators.enviarTransferenciaButton;
        if(!button) throw new Error(`Button '${this.locators.enviarTransferenciaButton}' not found`);
        await button.click();
        await capture(this.page, 'Envio de transferencia');
    }

    // ============ Validaciones de los elementos ============

    /** Verificar que la página se haya cargado correctamente */
    async expectPageLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/\//);
        await expect(this.locators.cuentaDestinoInput).toBeVisible({ timeout: 10000 });
    }

    /**
     * Verificar que un elemento específico esté visible
     * @param locator - Localizador del elemento a verificar
     */
    async expectElementVisible(locator: Locator): Promise<void> {
        await expect(locator).toBeVisible();
    }

    /**
     * Verifica el estado inicial del registro - TÉCNICA DE POLLING
     * @param locator - Localizador del elemento a verificar
     */
    async expectEstadoInicial(): Promise<void> {
        await expect(this.locators.estadoBox).toContainText('Estado: Esperando transacción...', { timeout: 5000 });
        /** 
        await expect(async () => {
        await expect(this.locators.estadoBox).toContainText('Estado: Esperando transacción...');
            }).toPass({
                // Opciones de polling:
                intervals: [1000, 2000, 5000], // Intervalos entre intentos (en milisegundos)
                timeout: 15000                 // Tiempo total máximo que durará el polling (15 segundos)
            });**/
    }

    /**
     * Verifica el estado final del registro - TÉCNICA DE POLLING
     * @param locator - Localizador del elemento a verificar
     */
    async expectEstadoFinal(): Promise<void> {
        await expect(this.locators.estadoBox).toContainText('Estado: APROBADO', { timeout: 20000 });
        
        /**const estadoFinal = (await this.locators.estadoBox.textContent())?.trim() ?? '';

        if (!estadoFinal.includes('APROBADO')) {
            await capture(this.page, 'Transferencia-exitosa');
        }else
        if (estadoFinal.includes('PENDIENTE')) {
            await capture(this.page, 'Transferencia-pendiente');
            throw new Error(`La transferencia falló con estado PENDIENTE: '${estadoFinal}'.`);
        }else            
        if (estadoFinal.includes('ERROR_TIMEOUT')) {
            await capture(this.page, 'Transferencia-error-timeout');
            throw new Error(`La transferencia falló con estado ERROR_TIMEOUT: '${estadoFinal}'.`);
        }**/
    }

    // ============ Estados ============

    /**
     * Validar si el campo Cuenta Destino (Ej: 98765) está visible
     */
    async isCuentaDestinoEjInputVisible(): Promise<boolean> {
        return await this.locators.cuentaDestinoInput.isVisible();
    }

    /**
     * Validar si el campo Monto ($) está visible
     */
    async isMontoInputVisible(): Promise<boolean> {
        return await this.locators.montoInput.isVisible();
    }

    /**
     * Validar si el botón Enviar Transferencia está visible
     */
    async isEnviarTransferenciaButtonVisible(): Promise<boolean> {
        return await this.locators.enviarTransferenciaButton.isVisible();
    }

    /**
     * Valida si el Estado está visible
     */
    async isEstadoBoxVisible(): Promise<boolean> {
        return await this.locators.estadoBox.isVisible();
    }

}