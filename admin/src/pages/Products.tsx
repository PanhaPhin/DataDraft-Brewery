import { useAxiosPrivate } from '@/hooks/useAxiosPrivate';
import type { Brand, Category, Product } from '@/lib/type';
import useAuthStore from '@/store/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { productSchema } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, RefreshCcw, Plus, Pencil, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ProductSkeleton from '../components/skeletons/ProductSkeleton';
import ImageUpload from '@/components/ui/image.upload';

type ProductFormValues = z.input<typeof productSchema>;

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const { checkIsAdmin } = useAuthStore();
  const isAdmin = checkIsAdmin();

  const defaultFormValues: ProductFormValues = {
    name: "",
    description: "",
    price: 0,
    discountPercentage: 10,
    stock: 10,
    category: "",
    brand: "",
    image: "",
  };

  const formAdd = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultFormValues,
  });

  const formEdit = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultFormValues,
  });

  const fetchProducts = async (resetPage = false, sortOverride?: "asc" | "desc") => {
    setLoading(true);

    try {
      const currentPage = resetPage ? 1 : page;
      const response = await axiosPrivate.get("/products", {
        params: { page: currentPage, perPage, sortOrder: sortOverride ?? sortOrder },
      });
      setProducts(response.data.products || []);
      setTotal(response.data.total || 0);
      setTotalPages(
        response.data.totalPages ||
          Math.ceil((response.data.total || 0) / perPage)
      );

      if (resetPage) {
        setPage(1);
      }
    } catch (error) {
      console.log("Failed to load products", error);
      toast("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosPrivate.get("/categories");
      setCategories(response.data.categories || response.data || []);
    } catch (error) {
      console.log("Failed to load categories", error);
      toast("Failed to load categories");
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axiosPrivate.get("/brands");
      setBrands(response.data.brands || response.data || []);
    } catch (error) {
      console.log("Failed to load brands", error);
      toast("Failed to load brands");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchProducts();
    } finally {
      setRefreshing(false);
    }
  };

  const handleSortChange = (value: "asc" | "desc") => {
    setSortOrder(value);
    fetchProducts(true, value);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const openAddModal = () => {
    formAdd.reset(defaultFormValues);
    setIsAddModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    formEdit.reset({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPercentage: product.discountPercentage,
      stock: product.stock,
      category: typeof product.category === "string" ? product.category : (product.category as any)?._id ?? "",
      brand: typeof product.brand === "string" ? product.brand : (product.brand as any)?._id ?? "",
      image: product.image,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleAddSubmit = async (values: ProductFormValues) => {
    setFormLoading(true);
    try {
      await axiosPrivate.post("/products", values);
      toast("Product created");
      setIsAddModalOpen(false);
      formAdd.reset(defaultFormValues);
      fetchProducts(true);
    } catch (error) {
      console.log("Failed to create product", error);
      toast("Failed to create product");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditSubmit = async (values: ProductFormValues) => {
    if (!selectedProduct) return;
    setFormLoading(true);
    try {
      await axiosPrivate.put(`/products/${selectedProduct._id}`, values);
      toast("Product updated");
      setIsEditModalOpen(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (error) {
      console.log("Failed to update product", error);
      toast("Failed to update product");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    setFormLoading(true);
    try {
      await axiosPrivate.delete(`/products/${selectedProduct._id}`);
      toast("Product deleted");
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (error) {
      console.log("Failed to delete product", error);
      toast("Failed to delete product");
    } finally {
      setFormLoading(false);
    }
  };

  const renderProductForm = (
    form: typeof formAdd,
    onSubmit: (values: ProductFormValues) => void
  ) => (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...form.register("name")} />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">{form.formState.errors.name.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...form.register("description")} />
        {form.formState.errors.description && (
          <p className="text-sm text-destructive">{form.formState.errors.description.message as string}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="number" step="0.01" {...form.register("price", { valueAsNumber: true })} />
          {form.formState.errors.price && (
            <p className="text-sm text-destructive">{form.formState.errors.price.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="discountPercentage">Discount %</Label>
          <Input
            id="discountPercentage"
            type="number"
            step="0.01"
            {...form.register("discountPercentage", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="stock">Stock</Label>
        <Input id="stock" type="number" {...form.register("stock", { valueAsNumber: true })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <ImageUpload
          value={form.watch("image") || ""}
          onChange={(base64) => form.setValue("image", base64, { shouldValidate: true, shouldDirty: true })}
          disabled={formLoading}
        />
        {form.formState.errors.image && (
          <p className="text-sm text-destructive">{form.formState.errors.image.message as string}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            className="w-full rounded-md border bg-background p-2 text-sm"
            {...form.register("category")}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <select
            id="brand"
            className="w-full rounded-md border bg-background p-2 text-sm"
            {...form.register("brand")}
          >
            <option value="">Select brand</option>
            {brands.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={formLoading}>
          {formLoading ? "Saving..." : "Save"}
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <div className="p-5 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-end gap-3">
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-sm font-medium">
            Total <span className="font-bold">{total}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-2 shadow-sm">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-background text-sm p-2 shadow-sm hover:bg-muted/10 focus:ring-2 focus:ring-ring"
          >
            <RefreshCcw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>

          <Select value={sortOrder} onValueChange={handleSortChange}>
            <SelectTrigger
              className="w-40 bg-background text-sm shadow-sm hover:bg-muted/10 focus:ring-2 focus:ring-ring"
              aria-label="Sort order"
            >
              <SelectValue placeholder="Sort Order" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="asc">
                <span className="flex items-center">
                  <ArrowUp className="mr-2 h-4 w-4" />
                  Ascending
                </span>
              </SelectItem>
              <SelectItem value="desc">
                <span className="flex items-center">
                  <ArrowDown className="mr-2 h-4 w-4" />
                  Descending
                </span>
              </SelectItem>
            </SelectContent>
          </Select>

          {isAdmin && (
            <Button
              onClick={openAddModal}
              className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <ProductSkeleton isAdmin={isAdmin} />
      ) : (
        <div className="rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                {isAdmin && <TableHead className="text-right">Action</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 9 : 8} className="text-center py-8">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-muted" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>${product.price?.toFixed(2)}</TableCell>
                    <TableCell>{product.discountPercentage ?? 0}%</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.averageRating?.toFixed(1) ?? "—"}</TableCell>
                    <TableCell>
                      {typeof product.category === "string"
                        ? product.category
                        : (product.category as any)?.name}
                    </TableCell>
                    <TableCell>
                      {typeof product.brand === "string"
                        ? product.brand
                        : (product.brand as any)?.name}
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditModal(product)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDeleteModal(product)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={page <= 1}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextPage} disabled={page >= totalPages}>
            Next
          </Button>
        </div>
      </div>

      {/* Add Product Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
          </DialogHeader>
          {renderProductForm(formAdd, handleAddSubmit)}
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {renderProductForm(formEdit, handleEditSubmit)}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={formLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={formLoading}>
              {formLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Products;