import { Metadata } from "next";
import { User, Mail, Phone, MapPin, Calendar, Building, Save } from "lucide-react";

interface ProfileSettingsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: ProfileSettingsPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: "Profil - Paramètres - Plannitech",
    description: "Gérez vos informations personnelles",
    alternates: {
      canonical: `/${locale}/dashboard/settings/profile`,
      languages: {
        'fr': '/fr/dashboard/settings/profile',
        'en': '/en/dashboard/settings/profile',
        'es': '/es/dashboard/settings/profile',
      },
    },
  };
}

export default async function ProfileSettingsPage({ params }: ProfileSettingsPageProps) {
  const { locale } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === 'en' ? 'Profile Settings' : locale === 'es' ? 'Configuración de Perfil' : 'Paramètres de Profil'}
        </h1>
        <p className="text-gray-600">
          {locale === 'en' 
            ? 'Manage your personal information and contact details' 
            : locale === 'es' 
            ? 'Gestiona tu información personal y datos de contacto'
            : 'Gérez vos informations personnelles et coordonnées'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations personnelles */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              {locale === 'en' ? 'Personal Information' : locale === 'es' ? 'Información Personal' : 'Informations Personnelles'}
            </h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === 'en' ? 'First Name' : locale === 'es' ? 'Nombre' : 'Prénom'}
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={locale === 'en' ? 'Enter your first name' : locale === 'es' ? 'Ingresa tu nombre' : 'Entrez votre prénom'}
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === 'en' ? 'Last Name' : locale === 'es' ? 'Apellido' : 'Nom'}
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={locale === 'en' ? 'Enter your last name' : locale === 'es' ? 'Ingresa tu apellido' : 'Entrez votre nom'}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'en' ? 'Email Address' : locale === 'es' ? 'Dirección de Email' : 'Adresse Email'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={locale === 'en' ? 'Enter your email' : locale === 'es' ? 'Ingresa tu email' : 'Entrez votre email'}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'en' ? 'Phone Number' : locale === 'es' ? 'Número de Teléfono' : 'Numéro de Téléphone'}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={locale === 'en' ? 'Enter your phone number' : locale === 'es' ? 'Ingresa tu número de teléfono' : 'Entrez votre numéro de téléphone'}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'en' ? 'Address' : locale === 'es' ? 'Dirección' : 'Adresse'}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={locale === 'en' ? 'Enter your address' : locale === 'es' ? 'Ingresa tu dirección' : 'Entrez votre adresse'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === 'en' ? 'Birth Date' : locale === 'es' ? 'Fecha de Nacimiento' : 'Date de Naissance'}
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === 'en' ? 'Company' : locale === 'es' ? 'Empresa' : 'Entreprise'}
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="company"
                      name="company"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={locale === 'en' ? 'Enter your company' : locale === 'es' ? 'Ingresa tu empresa' : 'Entrez votre entreprise'}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {locale === 'en' ? 'Save Changes' : locale === 'es' ? 'Guardar Cambios' : 'Enregistrer les Modifications'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Informations du compte */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {locale === 'en' ? 'Account Information' : locale === 'es' ? 'Información de Cuenta' : 'Informations du Compte'}
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {locale === 'en' ? 'Member since' : locale === 'es' ? 'Miembro desde' : 'Membre depuis'}
                </span>
                <span className="text-sm font-medium text-gray-900">Janvier 2024</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {locale === 'en' ? 'Last login' : locale === 'es' ? 'Último acceso' : 'Dernière connexion'}
                </span>
                <span className="text-sm font-medium text-gray-900">Aujourd'hui</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {locale === 'en' ? 'Account status' : locale === 'es' ? 'Estado de cuenta' : 'Statut du compte'}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {locale === 'en' ? 'Active' : locale === 'es' ? 'Activo' : 'Actif'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {locale === 'en' ? 'Profile Picture' : locale === 'es' ? 'Foto de Perfil' : 'Photo de Profil'}
            </h3>
            
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-gray-400" />
              </div>
              <div>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {locale === 'en' ? 'Change Photo' : locale === 'es' ? 'Cambiar Foto' : 'Changer la Photo'}
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  {locale === 'en' ? 'JPG, PNG up to 2MB' : locale === 'es' ? 'JPG, PNG hasta 2MB' : 'JPG, PNG jusqu\'à 2MB'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {locale === 'en' ? 'Professional Information' : locale === 'es' ? 'Información Profesional' : 'Informations Professionnelles'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'en' ? 'Job Title' : locale === 'es' ? 'Cargo' : 'Poste'}
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={locale === 'en' ? 'e.g. Régisseur' : locale === 'es' ? 'ej. Regidor' : 'ex. Régisseur'}
                />
              </div>
              
              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'en' ? 'Specialty' : locale === 'es' ? 'Especialidad' : 'Spécialité'}
                </label>
                <select
                  id="specialty"
                  name="specialty"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">
                    {locale === 'en' ? 'Select specialty' : locale === 'es' ? 'Seleccionar especialidad' : 'Sélectionner une spécialité'}
                  </option>
                  <option value="regie-technique">
                    {locale === 'en' ? 'Technical Direction' : locale === 'es' ? 'Dirección Técnica' : 'Régie Technique'}
                  </option>
                  <option value="son">
                    {locale === 'en' ? 'Sound' : locale === 'es' ? 'Sonido' : 'Son'}
                  </option>
                  <option value="lumiere">
                    {locale === 'en' ? 'Lighting' : locale === 'es' ? 'Iluminación' : 'Lumière'}
                  </option>
                  <option value="video">
                    {locale === 'en' ? 'Video' : locale === 'es' ? 'Video' : 'Vidéo'}
                  </option>
                  <option value="scenographie">
                    {locale === 'en' ? 'Scenography' : locale === 'es' ? 'Escenografía' : 'Scénographie'}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
