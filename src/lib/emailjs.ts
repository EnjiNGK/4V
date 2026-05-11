import emailjs from "@emailjs/browser";

export const EMAILJS = {
  publicKey: "0n4YD-IOky7NozXof",
  serviceId: "service_4dxft8m",
  contactTemplateId: "template_qq7iz1v",
  sellTemplateId: "template_7oysq88",
};

let initialized = false;
function init() {
  if (initialized) return;
  emailjs.init({ publicKey: EMAILJS.publicKey });
  initialized = true;
}

export async function sendEmail(templateId: string, params: Record<string, any>) {
  init();
  return emailjs.send(EMAILJS.serviceId, templateId, params);
}
