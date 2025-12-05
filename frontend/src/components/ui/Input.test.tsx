import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './Input';

describe('Input 컴포넌트', () => {
  it('기본 입력 필드가 렌더링됨', () => {
    render(<Input placeholder="입력하세요" />);
    const input = screen.getByPlaceholderText('입력하세요');
    expect(input).toBeInTheDocument();
  });

  it('label이 표시됨', () => {
    render(<Input label="이메일" />);
    expect(screen.getByText('이메일')).toBeInTheDocument();
  });

  it('label과 input이 연결됨', () => {
    render(<Input label="사용자명" />);
    const label = screen.getByText('사용자명');
    expect(label.tagName).toBe('LABEL');
  });

  it('에러 메시지가 표시됨', () => {
    render(<Input error="필수 입력 항목입니다" />);
    expect(screen.getByText('필수 입력 항목입니다')).toBeInTheDocument();
  });

  it('에러 상태에서 에러 스타일이 적용됨', () => {
    render(<Input error="에러 발생" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-500', 'focus:ring-red-500');
  });

  it('fullWidth 속성이 적용됨', () => {
    render(<Input fullWidth />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('w-full');
  });

  it('disabled 상태가 적용됨', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('bg-gray-100', 'cursor-not-allowed');
  });

  it('사용자 입력이 정상 동작함', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="입력하세요" />);

    const input = screen.getByPlaceholderText('입력하세요');
    await user.type(input, '테스트 입력');

    expect(input).toHaveValue('테스트 입력');
  });

  it('onChange 이벤트가 정상 동작함', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'a');

    expect(handleChange).toHaveBeenCalled();
  });

  it('type 속성이 적용됨', () => {
    const { container } = render(<Input type="password" placeholder="비밀번호" />);
    const input = container.querySelector('input[type="password"]');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'password');
  });

  it('placeholder 속성이 적용됨', () => {
    render(<Input placeholder="이메일을 입력하세요" />);
    expect(screen.getByPlaceholderText('이메일을 입력하세요')).toBeInTheDocument();
  });

  it('커스텀 className이 적용됨', () => {
    render(<Input className="custom-input" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-input');
  });

  it('ref가 정상 동작함', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('value와 onChange가 함께 동작함 (제어 컴포넌트)', async () => {
    const user = userEvent.setup();
    let value = '';
    const handleChange = vi.fn((e) => {
      value = e.target.value;
    });

    const { rerender } = render(<Input value={value} onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'test');

    rerender(<Input value={value} onChange={handleChange} />);
    expect(handleChange).toHaveBeenCalled();
  });
});
