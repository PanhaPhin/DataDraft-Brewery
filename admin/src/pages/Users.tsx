import UserSkeleton from '@/components/skeletons/UserSkeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAxiosPrivate } from '@/hooks/useAxiosPrivate';
import type { User } from '@/lib/type';
import { cn } from '@/lib/utils';
import useAuthStore from '@/store/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, Pencil, Plus, RefreshCcw, Search, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { userSchema } from '@/lib/validation';
import type z from 'zod';
import ImageUpload from '@/components/ui/image.upload';

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [total, setTotal] = useState(0);

  const axiosPrivate = useAxiosPrivate();
  const { checkIsAdmin } = useAuthStore();
  const isAdmin = checkIsAdmin();

  type UserFormData = z.infer<typeof userSchema>;

  const formAdd = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
      avatar: '',
    },
  });

  const formEdit = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
      avatar: '',
    },
  });

  const fetchUsers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);

      }

      const response = await axiosPrivate.get('/users');

      console.log('Users API:', response.data);

      const userList = response.data?.users || [];

      setUsers(userList);
      setTotal(userList.length);
    } catch (error: any) {
      console.error('Fetch users error:', error);
      toast.error(
        error?.response?.data?.message || 'Failed to fetch users'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    await fetchUsers(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (data: UserFormData) => {
    setFormLoading(true);

    try {
      const response = await axiosPrivate.post('/users', data);

      console.log('Create user:', response.data);

      toast.success('User created successfully.');

      setIsAddModalOpen(false);
      formAdd.reset();

      // Refresh the table after creating
      await handleRefresh();
    } catch (error: any) {
      console.error('Error creating user:', error);

      toast.error(
        error?.response?.data?.message ||
        'Failed to create user. Please try again.'
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditUser = async (data: UserFormData) => {
    if (!selectedUser) return;
    setFormLoading(true);
    try {
      // Don't send an empty password field through as an update.
      const payload = { ...data };
      if (!payload.password) delete (payload as Partial<UserFormData>).password;

      const response = await axiosPrivate.put(`/users/${selectedUser._id}`, payload);
      if (response?.data) {
        toast.success('User updated successfully.');
        setIsEditModalOpen(false);
        setSelectedUser(null);
        formEdit.reset();
        fetchUsers();
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(error?.response?.data?.message || 'Failed to update user. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setDeleteLoading(true);
    try {
      await axiosPrivate.delete(`/users/${selectedUser._id}`);
      toast.success('User deleted successfully.');
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete user. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openViewModal = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    formEdit.reset({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      avatar: user.avatar || '',
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'deliveryman':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <UserSkeleton isAdmin={isAdmin} rows={5} />;
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">View and manage all system users</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{filteredUsers.length}</span>
            <span className="text-gray-500">
              {searchTerm || roleFilter !== 'all' ? `of ${total} users` : 'users'}
            </span>
          </div>

          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <RefreshCcw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>

          {isAdmin && (
            <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white w-full sm:w-64">
          <Search className="h-4 w-4 text-gray-400 shrink-0" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 shadow-none focus-visible:ring-0 p-0 h-auto"
          />
        </div>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by role..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="deliveryman">Deliveryman</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-semibold text-gray-700">Avatar</TableHead>
              <TableHead className="font-semibold text-gray-700">Name</TableHead>
              <TableHead className="font-semibold text-gray-700">Email</TableHead>
              <TableHead className="font-semibold text-gray-700">Role</TableHead>
              <TableHead className="font-semibold text-gray-700">Created At</TableHead>
              <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredUsers?.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold shadow-sm overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-lg">{user.name?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">{user.name}</TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    <Badge className={cn('capitalize', getRoleColor(user.role))}>{user.role}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                      : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openViewModal(user)}
                        title="View user"
                      >
                        <Eye className="h-4 w-4 text-gray-500" />
                      </Button>
                      {isAdmin && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditModal(user)}
                            title="Edit user"
                          >
                            <Pencil className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteModal(user)}
                            title="Delete user"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <Users className="h-12 w-12 text-gray-400" />
                    <p className="text-lg font-medium text-gray-900">No users found</p>
                    <p className="text-sm text-gray-500">
                      {searchTerm ? `No users found for "${searchTerm}"` : 'There are no users in the system.'}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add User modal */}
      <Dialog
        open={isAddModalOpen}
        onOpenChange={(open) => {
          setIsAddModalOpen(open);
          if (!open) formAdd.reset();
        }}
      >
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>
              Create a new user by filling out the form below. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <Form {...formAdd}>
            <form onSubmit={formAdd.handleSubmit(handleAddUser)} className="space-y-4">
              <FormField
                control={formAdd.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={formLoading}
                        className="border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={formAdd.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        disabled={formLoading}
                        className="border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={formAdd.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        disabled={formLoading}
                        className="border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={formAdd.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={formLoading}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300 rounded-lg">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="deliveryman">Deliveryman</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={formAdd.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Avatar (optional)</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        disabled={formLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={formLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={formLoading}>
                  {formLoading ? 'Creating...' : 'Create User'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit User modal */}
      <Dialog
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) {
            formEdit.reset();
            setSelectedUser(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update {selectedUser?.name}&apos;s details. Leave password blank to keep it unchanged.
            </DialogDescription>
          </DialogHeader>
          <Form {...formEdit}>
            <form onSubmit={formEdit.handleSubmit(handleEditUser)} className="space-y-4">
              <FormField
                control={formEdit.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={formLoading}
                        className="border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={formEdit.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        disabled={formLoading}
                        className="border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={formEdit.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">New Password (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Leave blank to keep current password"
                        {...field}
                        disabled={formLoading}
                        className="border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={formEdit.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={formLoading}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300 rounded-lg">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="deliveryman">Deliveryman</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={formEdit.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Avatar (optional)</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        disabled={formLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={formLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={formLoading}>
                  {formLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View User modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-5">
              {/* User Profile */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xl overflow-hidden shrink-0">
                  {selectedUser.avatar ? (
                    <img
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    selectedUser.name?.charAt(0).toUpperCase()
                  )}
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    {selectedUser.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              {/* User Information */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {/* User ID */}
                <div className="col-span-2">
                  <p className="text-gray-500">User ID</p>
                  <p
                    className="text-gray-900 mt-1 font-mono text-xs break-all"
                    title={selectedUser._id}
                  >
                    {selectedUser._id || "—"}
                  </p>
                </div>

                {/* Role */}
                <div>
                  <p className="text-gray-500">Role</p>
                  <Badge
                    className={cn(
                      "capitalize mt-1",
                      getRoleColor(selectedUser.role)
                    )}
                  >
                    {selectedUser.role || "user"}
                  </Badge>
                </div>

                {/* Created At */}
                <div>
                  <p className="text-gray-500">Created At</p>
                  <p className="text-gray-900 mt-1">
                    {selectedUser.createdAt
                      ? new Date(selectedUser.createdAt).toLocaleString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-medium">{selectedUser?.name}</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;