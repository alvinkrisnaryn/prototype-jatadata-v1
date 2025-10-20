import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import OtpVerify from '@/pages/auth/OtpVerify.vue'
import Swal from 'sweetalert2'

const pushMock = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock }),
}))

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(() => Promise.resolve()),
  },
}))

describe('OtpVerify.vue', () => {
  let wrapper

  beforeEach(() => {
    vi.useFakeTimers()
    wrapper = mount(OtpVerify)
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders OTP title properly', () => {
    expect(wrapper.text()).toContain('Lupa Password')
    expect(wrapper.text()).toContain('Masukkan kode OTP')
  })

  it('shows error swal when OTP less than 4 digits', async () => {
    await wrapper.find('button[type="submit"], .w-100.mb-3').trigger('click')
    expect(Swal.fire).toHaveBeenCalledWith({
      icon: 'error',
      title: 'Invalid OTP',
      text: 'Please enter a 4-digit OTP code.',
    })
  })

  it('calls Swal success and navigates to /new-pass when OTP valid', async () => {
    wrapper.vm.otp = ['1', '2', '3', '4']
    await wrapper.find('button[type="submit"], .w-100.mb-3').trigger('click')

    expect(Swal.fire).toHaveBeenCalledWith({
      icon: 'success',
      title: 'OTP Verified!',
      text: 'Your OTP has been verified successfully.',
    })

    await Promise.resolve()
    expect(pushMock).toHaveBeenCalledWith('/new-pass')
  })

  it('starts cooldown and shows countdown text when Resend OTP clicked', async () => {
    const resendButton = wrapper.find('.btn-resend-otp')
    await resendButton.trigger('click')

    expect(Swal.fire).toHaveBeenCalledWith({
      icon: 'info',
      title: 'OTP Sent!',
      text: 'A new OTP has been sent to your email.',
    })

    expect(wrapper.vm.isCooldown).toBe(true)
    expect(wrapper.text()).toContain('Kirim ulang kode dalam')

    vi.advanceTimersByTime(60000)
    expect(wrapper.vm.isCooldown).toBe(false)
  })
})
