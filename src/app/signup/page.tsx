'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';

const SignUp = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    shops: ['', '', ''],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const { name, value } = e.target;

    if (name === 'shops' && index !== undefined) {
      const updatedShops = [...formData.shops];
      updatedShops[index] = value;
      setFormData((prev) => ({ ...prev, shops: updatedShops }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validatePassword = (password: string) => {
    return /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(formData.password)) {
      toast.error('Password must be 8+ characters, with a number & special character');
      return;
    }

    const filteredShops = formData.shops.filter((shop) => shop.trim() !== '');
    if (filteredShops.length < 3) {
      toast.error('Please enter at least 3 shop names');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, shops: filteredShops }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Signup failed');

      toast.success('✅ Account created! Please login');
      router.push('/login');
    } catch (err: any) {
      toast.error(`${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded-xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-center">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter strong password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            At least 8 characters, one number, and one special character.
          </p>
        </div>

        <div className="space-y-2">
          <Label>Shop Names (Min 3)</Label>
          {formData.shops.map((shop, i) => (
            <Input
              key={i}
              placeholder={`Shop ${i + 1}`}
              value={shop}
              onChange={(e) => handleChange(e, i)}
              name="shops"
              required={i < 3}
            />
          ))}
          {formData.shops.length < 4 && (
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setFormData((prev) => ({ ...prev, shops: [...prev.shops, ''] }))
              }
              className="w-full mt-2"
            >
              + Add More Shop
            </Button>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </Button>
      </form>
    </div>
  );
};

export default SignUp;
