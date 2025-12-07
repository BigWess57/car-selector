'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"
import { Brand, Model } from '@/db/schema';


const VehicleSelector = () => {

  // --- États ---
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

  const [loadingBrands, setLoadingBrands] = useState(true);
  const [loadingModels, setLoadingModels] = useState(false);
  const [saving, setSaving] = useState(false);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Nettoyer le timer si le composant est détruit
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  // --- Chargement initial ---
  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await fetch('/api/brands');
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || data.error || "Erreur inconnue lors de la récupération des marques");
        }
        setBrands(data);
      } catch (e) {
        console.error("Erreur chargement des marques", e);
        toast.error("Chargement échoué", {
          description: "Erreur lors du chargement des marques : " + (e instanceof Error ? e.message : "Erreur inconnue lors de la récupération des marques"),
        })
      } finally {
        setLoadingBrands(false);
      }
    }
    fetchBrands();
  }, []);

  // --- Chargement des modèles ---
  useEffect(() => {
    if (!selectedBrand) {
      setModels([]);
      return;
    }
    async function fetchModels() {
      setLoadingModels(true);
      try {
        const res = await fetch(`/api/models/${selectedBrand!.id}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || data.error || "Erreur inconnue lors de la récupération des modèles");
        }
        setModels(data);
      } catch (e) {
        console.error("Erreur chargement des modèles", e);
        toast.error("Chargement échoué", {
          description: "Erreur lors du chargement des modèles : " + (e instanceof Error ? e.message : "Erreur inconnue lors de la récupération des modèles"),
        })
      } finally {
        setLoadingModels(false);
      }
    }
    fetchModels();
  }, [selectedBrand]);


  // --- Handlers ---
  
  const handleBrandChange = (value: string) => {
    const brandId = Number(value);
    const brand = brands.find((b) => b.id === brandId) || null;
 
    setSelectedBrand(brand);
    setSelectedModel(null);
  };

  const handleModelChange = async (value: string) => {
    const modelId = Number(value);
    const model = models.find((m) => m.id === modelId) || null;
    setSelectedModel(model);

    if (model && selectedBrand) {
      await saveSelection(selectedBrand.name, model.name);
    }
  };


  // Fonction utilitaire pour envoyer la selection
  const performSave = async (brandName: string, modelName: string) => {
    setSaving(true);
    try {
      const res = await fetch('/api/selections', {
        method: 'POST',
        body: JSON.stringify({ brandName, modelName }),
      });
      const data = await res.json();

      if (!res.ok) {
        setSelectedModel(null);
        throw new Error(data.message || data.error || "Erreur inconnue lors de l'enregistrement de la selection");
      }

      toast.success("Votre sélection a bien été sauvegardée dans la base de données.", {
        duration: 3000,
      })
    } catch (e) {
      console.error('Sauvegarde échouée', e);
      toast.error("Sauvegarde échouée", {
        description: "Erreur lors de la sauvegarde : " + (e instanceof Error ? e.message : "Erreur inconnue lors de l'enregistrement de la selection"), 
      })
    } finally {
      setSaving(false);
    }
  };

  //Foncion de Debounce pour la selection
  const saveSelection = async (brandName: string, modelName: string) => {
    // Si tout premier clic (pas de timer en cours)
    if (!saveTimeoutRef.current) {
      performSave(brandName, modelName);

      saveTimeoutRef.current = setTimeout(() => {
        saveTimeoutRef.current = null; 
      }, 500);
      
      return;
    }

    // Si un timer tourne déjà (l'utilisateur spamme ou change d'avis vite)
    // On annule le timer précédent (qu'il soit fictif ou réel)
    clearTimeout(saveTimeoutRef.current);

    // On programme une nouvelle exécution à la fin du délai
    saveTimeoutRef.current = setTimeout(() => {
      performSave(brandName, modelName); // Sauvegarde la DERNIÈRE valeur
      saveTimeoutRef.current = null;
    }, 500);
  };

  const handleReset = () => {
    setSelectedBrand(null);
    setSelectedModel(null);
    setModels([]);
  };

  return (
    <Card className="w-[400px] shadow-lg">
      <CardHeader>
        <CardTitle>Sélecteur de Véhicule</CardTitle>
        <CardDescription>Configurez votre choix ci-dessous</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        
        {/* Select Marque */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Marque
          </label>
          <Select 
            onValueChange={handleBrandChange} 
            value={selectedBrand ? String(selectedBrand.id) : ""} 
            disabled={loadingBrands}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir une marque" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((b) => (
                <SelectItem key={b.id} value={String(b.id)}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Select Modèle */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Modèle
          </label>
          <Select 
            onValueChange={handleModelChange}
            // IMPORTANT: Si selectedModel est null, la value doit être vide pour afficher le placeholder
            value={selectedModel ? String(selectedModel.id) : ""}
            disabled={!selectedBrand || loadingModels}
          >
            <SelectTrigger>
              <SelectValue placeholder={loadingModels ? "Chargement..." : "Choisir un modèle"} />
            </SelectTrigger>
            <SelectContent>
              {models.map((m) => (
                <SelectItem key={m.id} value={String(m.id)}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Zone de Résumé */}
        <div className="rounded-md border bg-slate-50 p-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold uppercase text-slate-500">Votre sélection</span>
            {saving && <span className="text-xs text-green-600 font-medium animate-pulse">Sauvegarde...</span>}
          </div>
          <div className="text-lg font-medium min-h-7">
            {selectedBrand && selectedModel ? (
              <span className="text-slate-900">{selectedBrand.name} – {selectedModel.name}</span>
            ) : (
              <span className="text-slate-400 italic text-sm">En attente de configuration...</span>
            )}
          </div>
        </div>

      </CardContent>

      <CardFooter>
        <Button 
          variant="secondary" 
          className="w-full hover:bg-gray-200" 
          onClick={handleReset}
          disabled={!selectedBrand}
        >
          Réinitialiser tout
        </Button>
      </CardFooter>
    </Card>
  );
}

export default VehicleSelector