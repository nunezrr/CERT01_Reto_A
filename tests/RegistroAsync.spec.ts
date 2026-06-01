import { test, expect } from '@playwright/test';
import { RegistroPageActions } from './RegistroPage.Actions';

test('Transferencia', async ({ page }) => {
  const registro = await new RegistroPageActions(page).open();

  try {

    await registro.expectPageLoaded();
    await registro.isEstadoBoxVisible();
    await registro.expectEstadoInicial();

    await registro.DatosRegistro('123456', '100');
    await registro.clickButton();

    await registro.expectEstadoFinal();
  } catch (error) {
      console.error("Ocurrió un error durante la ejecución Transferencia:", error);      throw error;  } finally {
      await page.close();
      console.log("El navegador se ha cerrado correctamente luego de la prueba Transferencia.");
  }
});

