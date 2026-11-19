import React from 'react';
import { FileText, ShieldCheck } from 'lucide-react';
import {
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Button
} from "@heroui/react";

export default function LegalModal({ isOpen, onOpenChange, modalType }) {
  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange}
      placement="center"
      backdrop="blur"
      classNames={{
        base: "bg-white dark:bg-[#1c182d] border border-slate-200 dark:border-white/10 text-[#242038] dark:text-[#f7ece1] rounded-3xl mx-4 max-w-lg shadow-2xl",
        header: "border-b border-slate-100 dark:border-white/10 pb-3 pt-5 px-6",
        body: "py-5 px-6",
        footer: "border-t border-slate-100 dark:border-white/10 pt-3 pb-5 px-6",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2 text-base font-bold">
              {modalType === 'terms' ? (
                <>
                  <FileText className="w-5 h-5 text-[#9067c6] shrink-0" />
                  <span>Términos y Condiciones</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Política de Privacidad</span>
                </>
              )}
            </ModalHeader>
            <ModalBody className="text-xs leading-relaxed space-y-3.5 text-slate-600 dark:text-[#cac4ce]">
              {modalType === 'terms' ? (
                <>
                  <p>
                    <strong className="text-[#242038] dark:text-[#f7ece1]">1. Propósito:</strong> PESHITO es una herramienta de registro y visualización de finanzas personales diseñada para acompañar tus hábitos de ahorro y control de gastos de forma autónoma.
                  </p>
                  <p>
                    <strong className="text-[#242038] dark:text-[#f7ece1]">2. Uso del servicio:</strong> El usuario es responsable de la veracidad de los datos registrados y del resguardo de sus credenciales de acceso.
                  </p>
                  <p>
                    <strong className="text-[#242038] dark:text-[#f7ece1]">3. Disponibilidad:</strong> La plataforma se ofrece como servicio continuo sin cargos ocultos ni vinculaciones bancarias obligatorias.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong className="text-[#242038] dark:text-[#f7ece1]">1. Cero venta de datos:</strong> En PESHITO tu información financiera es estrictamente tuya. No comercializamos métricas ni registros con entidades comerciales ni redes publicitarias.
                  </p>
                  <p>
                    <strong className="text-[#242038] dark:text-[#f7ece1]">2. Autenticación y resguardo:</strong> Tu cuenta opera mediante autenticación segura y cifrada para evitar accesos no autorizados a tus registros.
                  </p>
                  <p>
                    <strong className="text-[#242038] dark:text-[#f7ece1]">3. Exportación y portabilidad:</strong> Puedes exportar o eliminar tus presupuestos y movimientos cuando lo desees en formatos abiertos y compatibles.
                  </p>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button 
                className="bg-[#9067c6] hover:bg-[#8d86c9] text-white font-semibold rounded-xl px-5 text-xs shadow-md shadow-[#9067c6]/20 cursor-pointer" 
                onPress={onClose} 
                size="sm"
              >
                Entendido
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
