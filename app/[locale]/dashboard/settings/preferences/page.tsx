import { Metadata } from "next";
import { Palette, Globe, Calendar, Clock, Monitor, Sun, Moon, Settings, Save } from "lucide-react";

interface PreferencesSettingsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PreferencesSettingsPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: "Préférences - Paramètres - Plannitech",
    description: "Configurez vos préférences d'affichage et de langue",
    alternates: {
      canonical: `/${locale}/dashboard/settings/preferences`,
      languages: {
        'fr': '/fr/dashboard/settings/preferences',
        'en': '/en/dashboard/settings/preferences',
        'es': '/es/dashboard/settings/preferences',
      },
    },
  };
}

export default async function PreferencesSettingsPage({ params }: PreferencesSettingsPageProps) {
  const { locale } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === 'en' ? 'Preferences' : locale === 'es' ? 'Preferencias' : 'Préférences'}
        </h1>
        <p className="text-gray-600">
          {locale === 'en' 
            ? 'Customize your application experience' 
            : locale === 'es' 
            ? 'Personaliza tu experiencia de aplicación'
            : 'Personnalisez votre expérience d\'application'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Langue et région */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {locale === 'en' ? 'Language & Region' : locale === 'es' ? 'Idioma y Región' : 'Langue et Région'}
              </h2>
              <p className="text-sm text-gray-500">
                {locale === 'en' ? 'Set your preferred language and region' : locale === 'es' ? 'Establece tu idioma y región preferidos' : 'Définissez votre langue et région préférées'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Language' : locale === 'es' ? 'Idioma' : 'Langue'}
              </label>
              <select
                id="language"
                name="language"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue="fr"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>

            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Timezone' : locale === 'es' ? 'Zona Horaria' : 'Fuseau Horaire'}
              </label>
              <select
                id="timezone"
                name="timezone"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue="Europe/Paris"
              >
                <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
                <option value="Europe/London">Europe/London (UTC+0)</option>
                <option value="America/New_York">America/New_York (UTC-5)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (UTC-8)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
              </select>
            </div>

            <div>
              <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Date Format' : locale === 'es' ? 'Formato de Fecha' : 'Format de Date'}
              </label>
              <select
                id="dateFormat"
                name="dateFormat"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue="DD/MM/YYYY"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</option>
              </select>
            </div>

            <div>
              <label htmlFor="timeFormat" className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Time Format' : locale === 'es' ? 'Formato de Hora' : 'Format d\'Heure'}
              </label>
              <select
                id="timeFormat"
                name="timeFormat"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue="24h"
              >
                <option value="24h">24 heures (14:30)</option>
                <option value="12h">12 heures (2:30 PM)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Thème et apparence */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-purple-500 p-2 rounded-lg">
              <Palette className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {locale === 'en' ? 'Theme & Appearance' : locale === 'es' ? 'Tema y Apariencia' : 'Thème et Apparence'}
              </h2>
              <p className="text-sm text-gray-500">
                {locale === 'en' ? 'Customize the look and feel' : locale === 'es' ? 'Personaliza la apariencia' : 'Personnalisez l\'apparence'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {locale === 'en' ? 'Theme' : locale === 'es' ? 'Tema' : 'Thème'}
              </label>
              <div className="grid grid-cols-3 gap-3">
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="p-3 border-2 border-gray-200 rounded-lg peer-checked:border-blue-500 peer-checked:bg-blue-50">
                    <Sun className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                    <p className="text-xs text-center font-medium">
                      {locale === 'en' ? 'Light' : locale === 'es' ? 'Claro' : 'Clair'}
                    </p>
                  </div>
                </label>
                
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    className="sr-only peer"
                  />
                  <div className="p-3 border-2 border-gray-200 rounded-lg peer-checked:border-blue-500 peer-checked:bg-blue-50">
                    <Moon className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                    <p className="text-xs text-center font-medium">
                      {locale === 'en' ? 'Dark' : locale === 'es' ? 'Oscuro' : 'Sombre'}
                    </p>
                  </div>
                </label>
                
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value="auto"
                    className="sr-only peer"
                  />
                  <div className="p-3 border-2 border-gray-200 rounded-lg peer-checked:border-blue-500 peer-checked:bg-blue-50">
                    <Monitor className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                    <p className="text-xs text-center font-medium">
                      {locale === 'en' ? 'Auto' : locale === 'es' ? 'Auto' : 'Auto'}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="density" className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Interface Density' : locale === 'es' ? 'Densidad de Interfaz' : 'Densité d\'Interface'}
              </label>
              <select
                id="density"
                name="density"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue="comfortable"
              >
                <option value="compact">
                  {locale === 'en' ? 'Compact' : locale === 'es' ? 'Compacto' : 'Compact'}
                </option>
                <option value="comfortable">
                  {locale === 'en' ? 'Comfortable' : locale === 'es' ? 'Cómodo' : 'Confortable'}
                </option>
                <option value="spacious">
                  {locale === 'en' ? 'Spacious' : locale === 'es' ? 'Espacioso' : 'Spacieux'}
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Font Size' : locale === 'es' ? 'Tamaño de Fuente' : 'Taille de Police'}
              </label>
              <select
                id="fontSize"
                name="fontSize"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue="medium"
              >
                <option value="small">
                  {locale === 'en' ? 'Small' : locale === 'es' ? 'Pequeño' : 'Petit'}
                </option>
                <option value="medium">
                  {locale === 'en' ? 'Medium' : locale === 'es' ? 'Mediano' : 'Moyen'}
                </option>
                <option value="large">
                  {locale === 'en' ? 'Large' : locale === 'es' ? 'Grande' : 'Grand'}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Paramètres de calendrier */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-green-500 p-2 rounded-lg">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              {locale === 'en' ? 'Calendar Settings' : locale === 'es' ? 'Configuración de Calendario' : 'Paramètres de Calendrier'}
            </h2>
            <p className="text-sm text-gray-500">
              {locale === 'en' ? 'Configure your calendar preferences' : locale === 'es' ? 'Configura tus preferencias de calendario' : 'Configurez vos préférences de calendrier'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="weekStart" className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Week Starts On' : locale === 'es' ? 'Semana Comienza' : 'Semaine Commence'}
              </label>
              <select
                id="weekStart"
                name="weekStart"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue="monday"
              >
                <option value="sunday">
                  {locale === 'en' ? 'Sunday' : locale === 'es' ? 'Domingo' : 'Dimanche'}
                </option>
                <option value="monday">
                  {locale === 'en' ? 'Monday' : locale === 'es' ? 'Lunes' : 'Lundi'}
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="defaultView" className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Default View' : locale === 'es' ? 'Vista por Defecto' : 'Vue par Défaut'}
              </label>
              <select
                id="defaultView"
                name="defaultView"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue="week"
              >
                <option value="day">
                  {locale === 'en' ? 'Day' : locale === 'es' ? 'Día' : 'Jour'}
                </option>
                <option value="week">
                  {locale === 'en' ? 'Week' : locale === 'es' ? 'Semana' : 'Semaine'}
                </option>
                <option value="month">
                  {locale === 'en' ? 'Month' : locale === 'es' ? 'Mes' : 'Mois'}
                </option>
                <option value="agenda">
                  {locale === 'en' ? 'Agenda' : locale === 'es' ? 'Agenda' : 'Agenda'}
                </option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="workingHours" className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Working Hours' : locale === 'es' ? 'Horas de Trabajo' : 'Heures de Travail'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="time"
                  id="workingHoursStart"
                  name="workingHoursStart"
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  defaultValue="09:00"
                />
                <input
                  type="time"
                  id="workingHoursEnd"
                  name="workingHoursEnd"
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  defaultValue="18:00"
                />
              </div>
            </div>

            <div>
              <label htmlFor="eventDuration" className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Default Event Duration' : locale === 'es' ? 'Duración por Defecto' : 'Durée par Défaut'}
              </label>
              <select
                id="eventDuration"
                name="eventDuration"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue="60"
              >
                <option value="30">30 minutes</option>
                <option value="60">1 heure</option>
                <option value="90">1h30</option>
                <option value="120">2 heures</option>
                <option value="180">3 heures</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Paramètres spécifiques au spectacle vivant */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-orange-500 p-2 rounded-lg">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              {locale === 'en' ? 'Live Performance Settings' : locale === 'es' ? 'Configuración de Espectáculo' : 'Paramètres Spectacle Vivant'}
            </h2>
            <p className="text-sm text-gray-500">
              {locale === 'en' ? 'Configure settings specific to live performances' : locale === 'es' ? 'Configura ajustes específicos para espectáculos' : 'Configurez les paramètres spécifiques aux spectacles'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="defaultVenue" className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Default Venue' : locale === 'es' ? 'Lugar por Defecto' : 'Lieu par Défaut'}
              </label>
              <select
                id="defaultVenue"
                name="defaultVenue"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">
                  {locale === 'en' ? 'Select a venue' : locale === 'es' ? 'Seleccionar lugar' : 'Sélectionner un lieu'}
                </option>
                <option value="theatre-municipal">Théâtre Municipal</option>
                <option value="salle-des-fetes">Salle des Fêtes</option>
                <option value="centre-culturel">Centre Culturel</option>
                <option value="exterieur">Extérieur</option>
              </select>
            </div>

            <div>
              <label htmlFor="technicalTeam" className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Technical Team Size' : locale === 'es' ? 'Tamaño del Equipo Técnico' : 'Taille de l\'Équipe Technique'}
              </label>
              <select
                id="technicalTeam"
                name="technicalTeam"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue="medium"
              >
                <option value="small">
                  {locale === 'en' ? 'Small (1-3 people)' : locale === 'es' ? 'Pequeño (1-3 personas)' : 'Petit (1-3 personnes)'}
                </option>
                <option value="medium">
                  {locale === 'en' ? 'Medium (4-8 people)' : locale === 'es' ? 'Mediano (4-8 personas)' : 'Moyen (4-8 personnes)'}
                </option>
                <option value="large">
                  {locale === 'en' ? 'Large (9+ people)' : locale === 'es' ? 'Grande (9+ personas)' : 'Grand (9+ personnes)'}
                </option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="rehearsalTime" className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Default Rehearsal Time' : locale === 'es' ? 'Tiempo de Ensayo por Defecto' : 'Temps de Répétition par Défaut'}
              </label>
              <select
                id="rehearsalTime"
                name="rehearsalTime"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue="120"
              >
                <option value="60">1 heure</option>
                <option value="90">1h30</option>
                <option value="120">2 heures</option>
                <option value="180">3 heures</option>
                <option value="240">4 heures</option>
              </select>
            </div>

            <div>
              <label htmlFor="showDuration" className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Default Show Duration' : locale === 'es' ? 'Duración de Espectáculo por Defecto' : 'Durée de Spectacle par Défaut'}
              </label>
              <select
                id="showDuration"
                name="showDuration"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue="90"
              >
                <option value="60">1 heure</option>
                <option value="90">1h30</option>
                <option value="120">2 heures</option>
                <option value="150">2h30</option>
                <option value="180">3 heures</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton de sauvegarde */}
      <div className="flex justify-end">
        <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
          <Save className="h-4 w-4 mr-2" />
          {locale === 'en' ? 'Save Preferences' : locale === 'es' ? 'Guardar Preferencias' : 'Enregistrer les Préférences'}
        </button>
      </div>
    </div>
  );
}
