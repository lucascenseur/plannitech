"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TabsNavigation } from "@/components/ui/tabs-navigation";
import { 
  Package, 
  Building2, 
  ShoppingCart, 
  Hotel,
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  Download,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Euro,
  Users,
  MapPin,
  Phone,
  Mail,
  Star,
  Wrench,
  Truck,
  Utensils
} from "lucide-react";
import Link from "next/link";

interface ResourcesPageProps {
  params: Promise<{
    locale: string;
  }>;
}

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: 'available' | 'in_use' | 'maintenance' | 'retired';
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  location: string;
  purchaseDate: string;
  warrantyExpiry?: string;
  supplier: string;
  cost: number;
  description?: string;
}

interface Supplier {
  id: string;
  name: string;
  type: string;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  address: string;
  rating: number;
  status: 'active' | 'inactive' | 'blacklisted';
  totalOrders: number;
  totalSpent: number;
  lastOrder?: string;
}

interface PurchaseOrder {
  id: string;
  number: string;
  supplier: string;
  status: 'draft' | 'sent' | 'confirmed' | 'delivered' | 'cancelled';
  totalAmount: number;
  orderDate: string;
  expectedDelivery?: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

interface Accommodation {
  id: string;
  name: string;
  type: 'hotel' | 'apartment' | 'hostel' | 'other';
  address: string;
  city: string;
  capacity: number;
  pricePerNight: number;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  amenities: string[];
  rating: number;
  status: 'available' | 'booked' | 'maintenance';
  totalBookings: number;
}

export default function ResourcesPage({ params }: ResourcesPageProps) {
  const [locale, setLocale] = useState('fr');
  const [activeTab, setActiveTab] = useState('equipment');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [accommodation, setAccommodation] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);

  // Configuration des onglets
  const tabs = [
    {
      id: 'equipment',
      label: locale === 'en' ? 'Equipment' : locale === 'es' ? 'Equipamiento' : 'Matériel',
      icon: Package,
      count: equipment.length
    },
    {
      id: 'suppliers',
      label: locale === 'en' ? 'Suppliers' : locale === 'es' ? 'Proveedores' : 'Fournisseurs',
      icon: Building2,
      count: suppliers.length
    },
    {
      id: 'purchase-orders',
      label: locale === 'en' ? 'Purchase Orders' : locale === 'es' ? 'Órdenes de Compra' : 'Bons de Commande',
      icon: ShoppingCart,
      count: purchaseOrders.length
    },
    {
      id: 'accommodation',
      label: locale === 'en' ? 'Accommodation' : locale === 'es' ? 'Alojamiento' : 'Hébergement',
      icon: Hotel,
      count: accommodation.length
    }
  ];

  // Initialiser la locale
  useEffect(() => {
    params.then(({ locale }) => setLocale(locale));
  }, [params]);

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simuler des appels API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Données de démonstration
        setEquipment([
          {
            id: '1',
            name: 'Système Son JBL',
            type: 'Sound',
            status: 'available',
            condition: 'excellent',
            location: 'Entrepôt A',
            purchaseDate: '2023-01-15',
            warrantyExpiry: '2026-01-15',
            supplier: 'Audio Pro',
            cost: 2500,
            description: 'Système son professionnel 2x15"'
          }
        ]);
        
        setSuppliers([
          {
            id: '1',
            name: 'Audio Pro',
            type: 'Sound Equipment',
            contact: { name: 'Jean Dupont', phone: '+33 1 23 45 67 89', email: 'jean@audiopro.fr' },
            address: '123 Rue de la Musique, Paris',
            rating: 4.5,
            status: 'active',
            totalOrders: 15,
            totalSpent: 45000,
            lastOrder: '2024-01-15'
          }
        ]);
        
        setPurchaseOrders([
          {
            id: '1',
            number: 'PO-2024-001',
            supplier: 'Audio Pro',
            status: 'confirmed',
            totalAmount: 1500,
            orderDate: '2024-01-10',
            expectedDelivery: '2024-01-25',
            items: [
              { name: 'Microphone Shure SM58', quantity: 2, unitPrice: 150, total: 300 },
              { name: 'Câbles XLR 10m', quantity: 10, unitPrice: 25, total: 250 }
            ]
          }
        ]);
        
        setAccommodation([
          {
            id: '1',
            name: 'Hôtel des Arts',
            type: 'hotel',
            address: '45 Avenue des Champs-Élysées',
            city: 'Paris',
            capacity: 50,
            pricePerNight: 120,
            contact: { name: 'Marie Martin', phone: '+33 1 42 36 78 90', email: 'marie@hoteldesarts.fr' },
            amenities: ['WiFi', 'Parking', 'Restaurant', 'Gym'],
            rating: 4.2,
            status: 'available',
            totalBookings: 8
          }
        ]);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': case 'active': case 'confirmed': return 'bg-green-100 text-green-800';
      case 'in_use': case 'sent': case 'booked': return 'bg-blue-100 text-blue-800';
      case 'maintenance': case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'retired': case 'inactive': case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: { [key: string]: string } } = {
      en: {
        available: 'Available', in_use: 'In Use', maintenance: 'Maintenance', retired: 'Retired',
        active: 'Active', inactive: 'Inactive', blacklisted: 'Blacklisted',
        draft: 'Draft', sent: 'Sent', confirmed: 'Confirmed', delivered: 'Delivered', cancelled: 'Cancelled',
        booked: 'Booked'
      },
      es: {
        available: 'Disponible', in_use: 'En Uso', maintenance: 'Mantenimiento', retired: 'Retirado',
        active: 'Activo', inactive: 'Inactivo', blacklisted: 'En Lista Negra',
        draft: 'Borrador', sent: 'Enviado', confirmed: 'Confirmado', delivered: 'Entregado', cancelled: 'Cancelado',
        booked: 'Reservado'
      },
      fr: {
        available: 'Disponible', in_use: 'En Utilisation', maintenance: 'Maintenance', retired: 'Retiré',
        active: 'Actif', inactive: 'Inactif', blacklisted: 'Liste Noire',
        draft: 'Brouillon', sent: 'Envoyé', confirmed: 'Confirmé', delivered: 'Livré', cancelled: 'Annulé',
        booked: 'Réservé'
      }
    };
    return statusMap[locale]?.[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">
            {locale === 'en' ? 'Loading resources...' : locale === 'es' ? 'Cargando recursos...' : 'Chargement des ressources...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {locale === 'en' ? 'Resources & Equipment' : locale === 'es' ? 'Recursos y Equipamiento' : 'Ressources & Matériel'}
          </h1>
          <p className="text-gray-600">
            {locale === 'en' 
              ? 'Manage equipment, suppliers, purchase orders, and accommodation' 
              : locale === 'es' 
              ? 'Gestiona equipos, proveedores, órdenes de compra y alojamiento'
              : 'Gérez le matériel, fournisseurs, bons de commande et hébergement'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Filter' : locale === 'es' ? 'Filtrar' : 'Filtrer'}
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Export' : locale === 'es' ? 'Exportar' : 'Exporter'}
          </button>
          <Link
            href={`/${locale}/dashboard/resources/new`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Add Resource' : locale === 'es' ? 'Agregar Recurso' : 'Ajouter une Ressource'}
          </Link>
        </div>
      </div>

      {/* Navigation par onglets */}
      <TabsNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Contenu conditionnel selon l'onglet actif */}
      {activeTab === 'equipment' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipment.map((item) => (
              <Card key={item.id} className="bg-white text-gray-900">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Package className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <p className="text-sm text-gray-600">{item.type}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {getStatusText(item.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="text-gray-900">{item.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Condition:</span>
                      <span className="text-gray-900 capitalize">{item.condition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Supplier:</span>
                      <span className="text-gray-900">{item.supplier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cost:</span>
                      <span className="text-gray-900">{item.cost}€</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/${locale}/dashboard/resources/equipment/${item.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/${locale}/dashboard/resources/equipment/${item.id}/edit`}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'suppliers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suppliers.map((supplier) => (
              <Card key={supplier.id} className="bg-white text-gray-900">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{supplier.name}</CardTitle>
                        <p className="text-sm text-gray-600">{supplier.type}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(supplier.status)}>
                      {getStatusText(supplier.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{supplier.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{supplier.contact.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-gray-900">{supplier.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Orders:</span>
                      <span className="text-gray-900">{supplier.totalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Spent:</span>
                      <span className="text-gray-900">{supplier.totalSpent.toLocaleString()}€</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/${locale}/dashboard/resources/suppliers/${supplier.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/${locale}/dashboard/resources/suppliers/${supplier.id}/edit`}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'purchase-orders' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {purchaseOrders.map((order) => (
              <Card key={order.id} className="bg-white text-gray-900">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{order.number}</CardTitle>
                        <p className="text-sm text-gray-600">{order.supplier}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="text-gray-900">{order.orderDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="text-gray-900 font-semibold">{order.totalAmount.toLocaleString()}€</span>
                    </div>
                    {order.expectedDelivery && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expected:</span>
                        <span className="text-gray-900">{order.expectedDelivery}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items:</span>
                      <span className="text-gray-900">{order.items.length}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/${locale}/dashboard/resources/purchase-orders/${order.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/${locale}/dashboard/resources/purchase-orders/${order.id}/edit`}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'accommodation' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accommodation.map((place) => (
              <Card key={place.id} className="bg-white text-gray-900">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Hotel className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{place.name}</CardTitle>
                        <p className="text-sm text-gray-600">{place.city}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(place.status)}>
                      {getStatusText(place.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{place.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="text-gray-900">{place.capacity} {locale === 'en' ? 'people' : locale === 'es' ? 'personas' : 'personnes'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price/Night:</span>
                      <span className="text-gray-900">{place.pricePerNight}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-gray-900">{place.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bookings:</span>
                      <span className="text-gray-900">{place.totalBookings}</span>
                    </div>
                  </div>
                  {place.amenities && place.amenities.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        {locale === 'en' ? 'Amenities:' : locale === 'es' ? 'Comodidades:' : 'Équipements :'}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {place.amenities.slice(0, 3).map((amenity, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">
                            {amenity}
                          </span>
                        ))}
                        {place.amenities.length > 3 && (
                          <span className="text-xs text-gray-500">+{place.amenities.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/${locale}/dashboard/resources/accommodation/${place.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/${locale}/dashboard/resources/accommodation/${place.id}/edit`}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <div className="bg-blue-50 text-blue-900 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Package className="h-6 w-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-blue-900">
              {locale === 'en' ? 'Quick Actions' : locale === 'es' ? 'Acciones Rápidas' : 'Actions Rapides'}
            </h3>
            <p className="text-blue-700 mt-1">
              {locale === 'en' 
                ? 'Manage your resources and equipment efficiently.'
                : locale === 'es'
                ? 'Gestiona tus recursos y equipos eficientemente.'
                : 'Gérez vos ressources et équipements efficacement.'
              }
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link 
                href={`/${locale}/dashboard/resources/equipment/new`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                <Package className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Add Equipment' : locale === 'es' ? 'Agregar Equipo' : 'Ajouter du Matériel'}
              </Link>
              <Link 
                href={`/${locale}/dashboard/resources/suppliers/new`}
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-md border border-blue-600 hover:bg-blue-50"
              >
                <Building2 className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Add Supplier' : locale === 'es' ? 'Agregar Proveedor' : 'Ajouter un Fournisseur'}
              </Link>
              <Link 
                href={`/${locale}/dashboard/resources/purchase-orders/new`}
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-md border border-blue-600 hover:bg-blue-50"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Create Purchase Order' : locale === 'es' ? 'Crear Orden de Compra' : 'Créer un Bon de Commande'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
