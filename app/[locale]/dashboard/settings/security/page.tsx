import { Metadata } from "next";
import { Shield, Key, Smartphone, Eye, EyeOff, AlertTriangle, CheckCircle, Lock, Unlock, Download, Trash2 } from "lucide-react";

interface SecuritySettingsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: SecuritySettingsPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: "Sécurité - Paramètres - Plannitech",
    description: "Gérez la sécurité de votre compte",
    alternates: {
      canonical: `/${locale}/dashboard/settings/security`,
      languages: {
        'fr': '/fr/dashboard/settings/security',
        'en': '/en/dashboard/settings/security',
        'es': '/es/dashboard/settings/security',
      },
    },
  };
}

export default async function SecuritySettingsPage({ params }: SecuritySettingsPageProps) {
  const { locale } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === 'en' ? 'Security Settings' : locale === 'es' ? 'Configuración de Seguridad' : 'Paramètres de Sécurité'}
        </h1>
        <p className="text-gray-600">
          {locale === 'en' 
            ? 'Manage your account security and privacy settings' 
            : locale === 'es' 
            ? 'Gestiona la seguridad de tu cuenta y configuración de privacidad'
            : 'Gérez la sécurité de votre compte et les paramètres de confidentialité'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Changement de mot de passe */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Key className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {locale === 'en' ? 'Change Password' : locale === 'es' ? 'Cambiar Contraseña' : 'Changer le Mot de Passe'}
              </h2>
              <p className="text-sm text-gray-500">
                {locale === 'en' ? 'Update your account password' : locale === 'es' ? 'Actualiza la contraseña de tu cuenta' : 'Mettez à jour le mot de passe de votre compte'}
              </p>
            </div>
          </div>

          <form className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Current Password' : locale === 'es' ? 'Contraseña Actual' : 'Mot de Passe Actuel'}
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={locale === 'en' ? 'Enter current password' : locale === 'es' ? 'Ingresa contraseña actual' : 'Entrez le mot de passe actuel'}
                />
                <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer" />
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'New Password' : locale === 'es' ? 'Nueva Contraseña' : 'Nouveau Mot de Passe'}
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={locale === 'en' ? 'Enter new password' : locale === 'es' ? 'Ingresa nueva contraseña' : 'Entrez le nouveau mot de passe'}
                />
                <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer" />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Confirm New Password' : locale === 'es' ? 'Confirmar Nueva Contraseña' : 'Confirmer le Nouveau Mot de Passe'}
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={locale === 'en' ? 'Confirm new password' : locale === 'es' ? 'Confirma nueva contraseña' : 'Confirmez le nouveau mot de passe'}
                />
                <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <Key className="h-4 w-4 mr-2" />
              {locale === 'en' ? 'Update Password' : locale === 'es' ? 'Actualizar Contraseña' : 'Mettre à jour le Mot de Passe'}
            </button>
          </form>
        </div>

        {/* Authentification à deux facteurs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-green-500 p-2 rounded-lg">
              <Smartphone className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {locale === 'en' ? 'Two-Factor Authentication' : locale === 'es' ? 'Autenticación de Dos Factores' : 'Authentification à Deux Facteurs'}
              </h2>
              <p className="text-sm text-gray-500">
                {locale === 'en' ? 'Add an extra layer of security' : locale === 'es' ? 'Añade una capa extra de seguridad' : 'Ajoutez une couche de sécurité supplémentaire'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {locale === 'en' ? '2FA Status' : locale === 'es' ? 'Estado 2FA' : 'Statut 2FA'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {locale === 'en' ? 'Currently disabled' : locale === 'es' ? 'Actualmente deshabilitado' : 'Actuellement désactivé'}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {locale === 'en' ? 'Disabled' : locale === 'es' ? 'Deshabilitado' : 'Désactivé'}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-700">
                  {locale === 'en' ? 'SMS Authentication' : locale === 'es' ? 'Autenticación SMS' : 'Authentification SMS'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-700">
                  {locale === 'en' ? 'Authenticator App' : locale === 'es' ? 'App Autenticador' : 'Application Authentificateur'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-700">
                  {locale === 'en' ? 'Backup Codes' : locale === 'es' ? 'Códigos de Respaldo' : 'Codes de Sauvegarde'}
                </span>
              </div>
            </div>

            <button className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">
              <Smartphone className="h-4 w-4 mr-2" />
              {locale === 'en' ? 'Enable 2FA' : locale === 'es' ? 'Habilitar 2FA' : 'Activer 2FA'}
            </button>
          </div>
        </div>
      </div>

      {/* Sessions actives */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-purple-500 p-2 rounded-lg">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              {locale === 'en' ? 'Active Sessions' : locale === 'es' ? 'Sesiones Activas' : 'Sessions Actives'}
            </h2>
            <p className="text-sm text-gray-500">
              {locale === 'en' ? 'Manage your active login sessions' : locale === 'es' ? 'Gestiona tus sesiones de inicio activas' : 'Gérez vos sessions de connexion actives'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {locale === 'en' ? 'Current Session' : locale === 'es' ? 'Sesión Actual' : 'Session Actuelle'}
                </h3>
                <p className="text-xs text-gray-500">
                  {locale === 'en' ? 'Chrome on macOS • Paris, France' : locale === 'es' ? 'Chrome en macOS • París, Francia' : 'Chrome sur macOS • Paris, France'}
                </p>
                <p className="text-xs text-gray-400">
                  {locale === 'en' ? 'Last active: Now' : locale === 'es' ? 'Última actividad: Ahora' : 'Dernière activité : Maintenant'}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {locale === 'en' ? 'Current' : locale === 'es' ? 'Actual' : 'Actuelle'}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <Smartphone className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {locale === 'en' ? 'Mobile App' : locale === 'es' ? 'App Móvil' : 'Application Mobile'}
                </h3>
                <p className="text-xs text-gray-500">
                  {locale === 'en' ? 'iOS Safari • Paris, France' : locale === 'es' ? 'iOS Safari • París, Francia' : 'iOS Safari • Paris, France'}
                </p>
                <p className="text-xs text-gray-400">
                  {locale === 'en' ? 'Last active: 2 hours ago' : locale === 'es' ? 'Última actividad: hace 2 horas' : 'Dernière activité : il y a 2 heures'}
                </p>
              </div>
            </div>
            <button className="text-red-600 hover:text-red-800 text-sm font-medium">
              {locale === 'en' ? 'Revoke' : locale === 'es' ? 'Revocar' : 'Révoquer'}
            </button>
          </div>
        </div>
      </div>

      {/* Paramètres de confidentialité */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-indigo-500 p-2 rounded-lg">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              {locale === 'en' ? 'Privacy Settings' : locale === 'es' ? 'Configuración de Privacidad' : 'Paramètres de Confidentialité'}
            </h2>
            <p className="text-sm text-gray-500">
              {locale === 'en' ? 'Control your privacy and data sharing' : locale === 'es' ? 'Controla tu privacidad y compartir datos' : 'Contrôlez votre confidentialité et le partage de données'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                {locale === 'en' ? 'Profile Visibility' : locale === 'es' ? 'Visibilidad del Perfil' : 'Visibilité du Profil'}
              </h3>
              <p className="text-xs text-gray-500">
                {locale === 'en' ? 'Allow other team members to see your profile' : locale === 'es' ? 'Permitir que otros miembros del equipo vean tu perfil' : 'Permettre aux autres membres de l\'équipe de voir votre profil'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                {locale === 'en' ? 'Activity Status' : locale === 'es' ? 'Estado de Actividad' : 'Statut d\'Activité'}
              </h3>
              <p className="text-xs text-gray-500">
                {locale === 'en' ? 'Show when you are online or offline' : locale === 'es' ? 'Mostrar cuando estés en línea o fuera de línea' : 'Afficher quand vous êtes en ligne ou hors ligne'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                {locale === 'en' ? 'Data Analytics' : locale === 'es' ? 'Análisis de Datos' : 'Analyses de Données'}
              </h3>
              <p className="text-xs text-gray-500">
                {locale === 'en' ? 'Help improve the app by sharing usage data' : locale === 'es' ? 'Ayuda a mejorar la app compartiendo datos de uso' : 'Aidez à améliorer l\'app en partageant les données d\'utilisation'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Actions dangereuses */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-red-500 p-2 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-red-900">
              {locale === 'en' ? 'Danger Zone' : locale === 'es' ? 'Zona de Peligro' : 'Zone Dangereuse'}
            </h2>
            <p className="text-sm text-red-700">
              {locale === 'en' ? 'Irreversible and destructive actions' : locale === 'es' ? 'Acciones irreversibles y destructivas' : 'Actions irréversibles et destructives'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white border border-red-200 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                {locale === 'en' ? 'Export Data' : locale === 'es' ? 'Exportar Datos' : 'Exporter les Données'}
              </h3>
              <p className="text-xs text-gray-500">
                {locale === 'en' ? 'Download all your data in a ZIP file' : locale === 'es' ? 'Descarga todos tus datos en un archivo ZIP' : 'Téléchargez toutes vos données dans un fichier ZIP'}
              </p>
            </div>
            <button className="inline-flex items-center px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              {locale === 'en' ? 'Export' : locale === 'es' ? 'Exportar' : 'Exporter'}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white border border-red-200 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                {locale === 'en' ? 'Delete Account' : locale === 'es' ? 'Eliminar Cuenta' : 'Supprimer le Compte'}
              </h3>
              <p className="text-xs text-gray-500">
                {locale === 'en' ? 'Permanently delete your account and all data' : locale === 'es' ? 'Eliminar permanentemente tu cuenta y todos los datos' : 'Supprimer définitivement votre compte et toutes les données'}
              </p>
            </div>
            <button className="inline-flex items-center px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">
              <Trash2 className="h-4 w-4 mr-2" />
              {locale === 'en' ? 'Delete' : locale === 'es' ? 'Eliminar' : 'Supprimer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
