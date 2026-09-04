import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { bannerSchema } from "@/lib/validation";
import useAuthStore from "@/store/useAuthStore";
import type z from "zod";

type Banner = {
  _id: string;
  name: string;
  title: string;
  startFrom: number;
  image: string;
  bannerType: string;
  createdAt: string;
};

type FormData = z.infer<typeof bannerSchema>;

const EMPTY_FORM: FormData = {
  name: "",
  title: "",
  startFrom: 0,
  image: "",
  bannerType: "",
};

const Banners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);

  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const axiosPrivate = useAxiosPrivate();
  const { checkIsAdmin } = useAuthStore();
  const isAdmin = checkIsAdmin();

  const formAdd = useForm<FormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: EMPTY_FORM,
  });

  const formEdit = useForm<FormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: EMPTY_FORM,
  });

  // Normalizes whatever shape the API returns into a plain Banner[].
  // Logs the raw payload once so we can see the actual shape in the console
  // and tighten this back down to a single line once confirmed.
  const normalizeBanners = (payload: unknown): Banner[] => {
    if (Array.isArray(payload)) return payload as Banner[];

    if (payload && typeof payload === "object") {
      const obj = payload as Record<string, unknown>;
      if (Array.isArray(obj.banners)) return obj.banners as Banner[];
      if (Array.isArray(obj.data)) return obj.data as Banner[];
      if (
        obj.data &&
        typeof obj.data === "object" &&
        Array.isArray((obj.data as Record<string, unknown>).banners)
      ) {
        return (obj.data as Record<string, unknown>).banners as Banner[];
      }
    }

    console.warn("Unexpected /banners response shape:", payload);
    return [];
  };

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosPrivate.get("/banners");
      setBanners(normalizeBanners(response.data));
    } catch {
      setError("Failed to load banners. Please try again.");
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setError(null);

      const response = await axiosPrivate.get("/banners");
      setBanners(normalizeBanners(response.data));
    } catch {
      setError("Failed to refresh banners. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };

  const closeAddModal = () => {
    formAdd.reset(EMPTY_FORM);
    setIsAddModalOpen(false);
  };

  const handleAddBanner = formAdd.handleSubmit(async (data) => {
    try {
      setAddLoading(true);

      const response = await axiosPrivate.post("/banners", data);
      const newBanner: Banner = response.data?.data ?? response.data;

      setBanners((prev) => [...prev, newBanner]);
      closeAddModal();
    } catch {
      setError("Failed to add banner. Please try again.");
    } finally {
      setAddLoading(false);
    }
  });

  const openEditModal = (banner: Banner) => {
    setSelectedBanner(banner);
    formEdit.reset({
      name: banner.name,
      title: banner.title,
      startFrom: banner.startFrom,
      image: banner.image ?? "",
      bannerType: banner.bannerType,
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    formEdit.reset(EMPTY_FORM);
    setSelectedBanner(null);
    setIsEditModalOpen(false);
  };

  const handleEditBanner = formEdit.handleSubmit(async (data) => {
    if (!selectedBanner) return;

    try {
      setEditLoading(true);

      const response = await axiosPrivate.put(
        `/banners/${selectedBanner._id}`,
        data
      );
      const updatedBanner: Banner = response.data?.data ?? response.data;

      setBanners((prev) =>
        prev.map((banner) =>
          banner._id === selectedBanner._id ? updatedBanner : banner
        )
      );
      closeEditModal();
    } catch {
      setError("Failed to update banner. Please try again.");
    } finally {
      setEditLoading(false);
    }
  });

  const openDeleteModal = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedBanner(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteBanner = async () => {
    if (!selectedBanner) return;

    try {
      setDeleteLoading(true);

      await axiosPrivate.delete(`/banners/${selectedBanner._id}`);

      setBanners((prev) =>
        prev.filter((banner) => banner._id !== selectedBanner._id)
      );
      closeDeleteModal();
    } catch {
      setError("Failed to delete banner. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="p-5 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Banners</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your banners
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
              Add Banner
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
            Loading banners...
          </p>
        </div>
      ) : !Array.isArray(banners) || banners.length === 0 ? (
        <div className="flex flex-col justify-center items-center min-h-[300px] rounded-md border">
          <p className="text-lg font-medium">No banners found</p>
          <p className="text-sm text-muted-foreground mt-1">
            There are no banners available.
          </p>

          {isAdmin && (
            <Button className="mt-4" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Banner
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
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Start From</TableHead>
                <TableHead>Created At</TableHead>
                {isAdmin && (
                  <TableHead className="text-right">Action</TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {banners.map((banner) => (
                <TableRow key={banner._id}>
                  <TableCell>
                    {banner.image ? (
                      <div className="h-12 w-12 rounded-md overflow-hidden bg-accent">
                        <img
                          src={banner.image}
                          alt={banner.name}
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

                  <TableCell className="font-medium">{banner.name}</TableCell>
                  <TableCell>{banner.title}</TableCell>
                  <TableCell>{banner.bannerType}</TableCell>
                  <TableCell>
                    {banner.startFrom
                      ? new Date(banner.startFrom).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "—"}
                  </TableCell>

                  <TableCell>
                    {banner.createdAt
                      ? new Date(banner.createdAt).toLocaleString("en-US", {
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
                          onClick={() => openEditModal(banner)}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteModal(banner)}
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
          <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold">Add Banner</h2>

            <form onSubmit={handleAddBanner} className="space-y-4 mt-5">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  {...formAdd.register("name")}
                  placeholder="Enter banner name"
                  className="w-full mt-1 rounded-md border px-3 py-2"
                />
                {formAdd.formState.errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {formAdd.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Title</label>
                <input
                  {...formAdd.register("title")}
                  placeholder="Enter banner title"
                  className="w-full mt-1 rounded-md border px-3 py-2"
                />
                {formAdd.formState.errors.title && (
                  <p className="text-sm text-red-500 mt-1">
                    {formAdd.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Banner Type</label>
                <input
                  {...formAdd.register("bannerType")}
                  placeholder="e.g. home, promo"
                  className="w-full mt-1 rounded-md border px-3 py-2"
                />
                {formAdd.formState.errors.bannerType && (
                  <p className="text-sm text-red-500 mt-1">
                    {formAdd.formState.errors.bannerType.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Start From</label>
                <Controller
                  control={formAdd.control}
                  name="startFrom"
                  render={({ field }) => (
                    <input
                      type="date"
                      value={
                        field.value
                          ? new Date(field.value).toISOString().slice(0, 10)
                          : ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? new Date(e.target.value).getTime() : 0
                        )
                      }
                      className="w-full mt-1 rounded-md border px-3 py-2"
                    />
                  )}
                />
                {formAdd.formState.errors.startFrom && (
                  <p className="text-sm text-red-500 mt-1">
                    {formAdd.formState.errors.startFrom.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Banner Image</label>
                <div className="mt-1">
                  <Controller
                    control={formAdd.control}
                    name="image"
                    render={({ field }) => (
                      <ImageUpload
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        disabled={addLoading}
                        variant="banner"
                      />
                    )}
                  />
                </div>
                {formAdd.formState.errors.image && (
                  <p className="text-sm text-red-500 mt-1">
                    {formAdd.formState.errors.image.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeAddModal}>
                  Cancel
                </Button>

                <Button type="submit" disabled={addLoading}>
                  {addLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Banner
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && selectedBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold">Edit Banner</h2>

            <form onSubmit={handleEditBanner} className="space-y-4 mt-5">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  {...formEdit.register("name")}
                  placeholder="Enter banner name"
                  className="w-full mt-1 rounded-md border px-3 py-2"
                />
                {formEdit.formState.errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {formEdit.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Title</label>
                <input
                  {...formEdit.register("title")}
                  placeholder="Enter banner title"
                  className="w-full mt-1 rounded-md border px-3 py-2"
                />
                {formEdit.formState.errors.title && (
                  <p className="text-sm text-red-500 mt-1">
                    {formEdit.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Banner Type</label>
                <input
                  {...formEdit.register("bannerType")}
                  placeholder="e.g. home, promo"
                  className="w-full mt-1 rounded-md border px-3 py-2"
                />
                {formEdit.formState.errors.bannerType && (
                  <p className="text-sm text-red-500 mt-1">
                    {formEdit.formState.errors.bannerType.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Start From</label>
                <Controller
                  control={formEdit.control}
                  name="startFrom"
                  render={({ field }) => (
                    <input
                      type="date"
                      value={
                        field.value
                          ? new Date(field.value).toISOString().slice(0, 10)
                          : ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? new Date(e.target.value).getTime() : 0
                        )
                      }
                      className="w-full mt-1 rounded-md border px-3 py-2"
                    />
                  )}
                />
                {formEdit.formState.errors.startFrom && (
                  <p className="text-sm text-red-500 mt-1">
                    {formEdit.formState.errors.startFrom.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Banner Image</label>
                <div className="mt-1">
                  <Controller
                    control={formEdit.control}
                    name="image"
                    render={({ field }) => (
                      <ImageUpload
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        disabled={editLoading}
                        variant="banner"
                      />
                    )}
                  />
                </div>
                {formEdit.formState.errors.image && (
                  <p className="text-sm text-red-500 mt-1">
                    {formEdit.formState.errors.image.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeEditModal}>
                  Cancel
                </Button>

                <Button type="submit" disabled={editLoading}>
                  {editLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Banner
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {isDeleteModalOpen && selectedBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
            <h2 className="text-xl font-semibold">Delete Banner</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {selectedBanner.name}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={closeDeleteModal}>
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={handleDeleteBanner}
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

export default Banners;