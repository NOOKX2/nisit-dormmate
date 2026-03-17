import { User, ChevronLeft } from "lucide-react";

interface Contact {
  id: string;
  name: string;
}

interface ContactListProps {
  contacts: Contact[];
  activeContact: Contact | null;
  onSelectContact: (contact: Contact) => void;
  onBack: () => void;
}

export function ContactList({ contacts, activeContact, onSelectContact, onBack }: ContactListProps) {
  return (
    <div className={`${activeContact ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden shrink-0`}>
      <div className="p-6 border-b border-gray-50 flex items-center gap-2">
        <button onClick={onBack} className="md:hidden text-gray-400 hover:text-gray-900">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-gray-900">แชทส่วนตัว</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {contacts.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-10">ยังไม่มีประวัติการแชท</p>
        ) : (
          contacts.map(contact => (
            <button
              key={contact.id}
              onClick={() => onSelectContact(contact)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all text-left ${
                activeContact?.id === contact.id ? 'bg-emerald-50 border border-emerald-100' : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${activeContact?.id === contact.id ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                <User size={20} />
              </div>
              <span className="font-bold text-gray-800 truncate">{contact.name}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}