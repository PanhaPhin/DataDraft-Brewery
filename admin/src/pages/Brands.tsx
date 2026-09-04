import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Pencil, Plus, RefreshCcw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ImageUpload from "@/components/ui/image.upload";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import type { Brand } from "@/lib/type";
import useAuthStore from "@/store/useAuthStore";


const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  image: z.string().optional(),
});

type FormData = z.infer<typeof brandSchema>;

const EMPTY_FORM: FormData = { name: "", image: "" };

const Brands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const axiosPrivate = useAxiosPrivate();
  const { checkIsAdmin } = useAuthStore();
  const isAdmin = checkIsAdmin();

  const formAdd = useForm<FormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: EMPTY_FORM,
  });

  const formEdit = useForm<FormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: EMPTY_FORM,
  });

  const fetchBrands = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosPrivate.get("/brands");

      // Supports either { brands: [...] } or a bare [...] response
      setBrands(response.data?.brands ?? response.data ?? []);
    } catch {
      setError("Failed to load brands. Please try again.");
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setError(null);

      const response = await axiosPrivate.get("/brands");
      setBrands(response.data?.brands ?? response.data ?? []);
    } catch {
      setError("Failed to refresh brands. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };

  const closeAddModal = () => {
    formAdd.reset(EMPTY_FORM);
    setIsAddModalOpen(false);
  };

  const handleAddBrand = formAdd.handleSubmit(async (data) => {
    try {
      setAddLoading(true);

      const response = await axiosPrivate.post("/brands", data);
      const newBrand: Brand = response.data?.brand ?? response.data;

      setBrands((prev) => [...prev, newBrand]);
      closeAddModal();
    } catch {
      setError("Failed to add brand. Please try again.");
    } finally {
      setAddLoading(false);
    }
  });

  const openEditModal = (brand: Brand) => {
    setSelectedBrand(brand);
    formEdit.reset({ name: brand.name, image: brand.image ?? "" });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    formEdit.reset(EMPTY_FORM);
    setSelectedBrand(null);
    setIsEditModalOpen(false);
  };

  const handleEditBrand = formEdit.handleSubmit(async (data) => {
    if (!selectedBrand) return;

    try {
      setEditLoading(true);

      const response = await axiosPrivate.put(
        `/brands/${selectedBrand._id}`,
        data
      );
      const updatedBrand: Brand = response.data?.brand ?? response.data;

      setBrands((prev) =>
        prev.map((brand) =>
          brand._id === selectedBrand._id ? updatedBrand : brand
        )
      );
      closeEditModal();
    } catch {
      setError("Failed to update brand. Please try again.");
    } finally {
      setEditLoading(false);
    }
  });

  const openDeleteModal = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedBrand(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteBrand = async () => {
    if (!selectedBrand) return;

    try {
      setDeleteLoading(true);

      await axiosPrivate.delete(`/brands/${selectedBrand._id}`);

      setBrands((prev) =>
        prev.filter((brand) => brand._id !== selectedBrand._id)
      );
      closeDeleteModal();
    } catch {
      setError("Failed to delete brand. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="p-5 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Brands</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your brands
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCcw
              className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>

          {isAdmin && (
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Brand
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col justify-center items-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            Loading brands...
          </p>
        </div>
      ) : brands.length === 0 ? (
        <div className="flex flex-col justify-center items-center min-h-[300px] rounded-md border">
          <p className="text-lg font-medium">No brands found</p>
          <p className="text-sm text-muted-foreground mt-1">
            There are no brands available.
          </p>

          {isAdmin && (
            <Button className="mt-4" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Brand
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Created At</TableHead>
                {isAdmin && (
                  <TableHead className="text-right">Action</TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {brands.map((brand) => (
                <TableRow key={brand._id}>
                  <TableCell>
                    {brand.image ? (
                      <div className="h-12 w-12 rounded-md overflow-hidden bg-accent">
                        <img
                          src={brand.image}
                          alt={brand.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-accent flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">
                          No Image
                        </span>
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="font-medium">{brand.name}</TableCell>

                  <TableCell>
                    {brand.createdAt
                      ? new Date(brand.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </TableCell>

                  {isAdmin && (
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(brand)}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteModal(brand)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* ADD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
            <h2 className="text-xl font-semibold">Add Brand</h2>

            <form onSubmit={handleAddBrand} className="space-y-4 mt-5">
              <div>
                <label className="text-sm font-medium">Brand Name</label>
                <input
                  {...formAdd.register("name")}
                  placeholder="Enter brand name"
                  className="w-full mt-1 rounded-md border px-3 py-2"
                />
                {formAdd.formState.errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {formAdd.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Brand Image</label>
                <div className="mt-1">
                  <Controller
                    control={formAdd.control}
                    name="image"
                    render={({ field }) => (
                      <ImageUpload
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        disabled={addLoading}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeAddModal}>
                  Cancel
                </Button>

                <Button type="submit" disabled={addLoading}>
                  {addLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Brand
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && selectedBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
            <h2 className="text-xl font-semibold">Edit Brand</h2>

            <form onSubmit={handleEditBrand} className="space-y-4 mt-5">
              <div>
                <label className="text-sm font-medium">Brand Name</label>
                <input
                  {...formEdit.register("name")}
                  placeholder="Enter brand name"
                  className="w-full mt-1 rounded-md border px-3 py-2"
                />
                {formEdit.formState.errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {formEdit.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Brand Image</label>
                <div className="mt-1">
                  <Controller
                    control={formEdit.control}
                    name="image"
                    render={({ field }) => (
                      <ImageUpload
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        disabled={editLoading}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeEditModal}>
                  Cancel
                </Button>

                <Button type="submit" disabled={editLoading}>
                  {editLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Brand
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {isDeleteModalOpen && selectedBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
            <h2 className="text-xl font-semibold">Delete Brand</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {selectedBrand.name}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={closeDeleteModal}>
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={handleDeleteBrand}
                disabled={deleteLoading}
              >
                {deleteLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brands;