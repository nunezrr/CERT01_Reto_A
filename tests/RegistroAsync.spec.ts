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

test('TransferenciaMultiple', async ({ page }) => {
  const registro = await new RegistroPageActions(page).open();

  const usuariosPrueba = [
    { cuenta: '123', monto: '100' },
    { cuenta: '456', monto: '200' },
    { cuenta: '789', monto: '300' }
  ];

  try {
    for (const usuario of usuariosPrueba) {

      await registro.expectPageLoaded();
      await registro.isEstadoBoxVisible();
      await registro.expectEstadoInicial();

      await registro.DatosRegistro(usuario.cuenta, usuario.monto);
      await registro.clickButton();

      await registro.expectEstadoFinal();
            
      await page.reload();
      console.log("El navegador se ha refrescado correctamente luego de la prueba.", usuario.cuenta);
    }
  } catch (error) {
      console.error("Ocurrió un error durante la ejecución de la transferencia:", error);
  } finally {
      await page.close();
      console.log("El navegador se ha cerrado correctamente luego de la prueba de Transferencia.");
  }
});
