import { CONTACT } from "@/lib/content";
import s from "./Site.module.css";

/** Floating WhatsApp shortcut: UAE recruiters often prefer it to email. */
export default function WhatsAppButton() {
  return (
    <a className={`${s.whatsapp} mono`} href={CONTACT.whatsapp} target="_blank" rel="noreferrer" aria-label={`Message Prince on WhatsApp, ${CONTACT.phone}`}>
      <svg viewBox="0 0 32 32" aria-hidden="true" width="22" height="22">
        <path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm0 23.7a10.7 10.7 0 0 1-5.5-1.5l-.4-.2-3.9 1 1-3.8-.2-.4A10.7 10.7 0 1 1 16 26.7Zm5.9-8c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0a8.8 8.8 0 0 1-4.4-3.8c-.3-.6.3-.5.9-1.7a.6.6 0 0 0 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.7 3.7 0 0 0-1.1 2.7 6.4 6.4 0 0 0 1.3 3.4 14.6 14.6 0 0 0 5.6 5c2.1.9 2.9 1 4 .8a3.4 3.4 0 0 0 2.2-1.6 2.8 2.8 0 0 0 .2-1.6c-.1-.2-.3-.3-.6-.4Z"/>
      </svg>
      <span>WhatsApp</span>
    </a>
  );
}
