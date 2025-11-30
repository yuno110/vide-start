import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';
import { useRegister, getErrorMessage } from '../hooks/useRegister';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const registerMutation = useRegister();

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2">Sign up</h1>
          <p className="text-center mb-6">
            <Link to="/login" className="text-green-600 hover:text-green-700">
              Have an account?
            </Link>
          </p>

          {registerMutation.isError && (
            <ErrorMessage className="mb-4">
              {getErrorMessage(registerMutation.error)}
            </ErrorMessage>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Username"
                  {...register('username', {
                    required: '사용자명을 입력해주세요.',
                    minLength: {
                      value: 3,
                      message: '사용자명은 최소 3자 이상이어야 합니다.',
                    },
                  })}
                  fullWidth
                  aria-invalid={errors.username ? 'true' : 'false'}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>

              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  {...register('email', {
                    required: '이메일을 입력해주세요.',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: '올바른 이메일 형식이 아닙니다.',
                    },
                  })}
                  fullWidth
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  {...register('password', {
                    required: '비밀번호를 입력해주세요.',
                    minLength: {
                      value: 8,
                      message: '비밀번호는 최소 8자 이상이어야 합니다.',
                    },
                  })}
                  fullWidth
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={registerMutation.isPending}
              >
                Sign up
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
