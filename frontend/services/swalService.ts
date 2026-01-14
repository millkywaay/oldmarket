import Swal from 'sweetalert2';

export const swalService = {
  success: (title: string, text: string = '') => {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      confirmButtonColor: '#3085d6',
    });
  },

  error: (title: string, text: string = 'Terjadi kesalahan sistem') => {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      confirmButtonColor: '#d33',
    });
  },
  confirm: async (title: string, text: string = "Tindakan ini tidak bisa dibatalkan!") => {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Lanjutkan!',
      cancelButtonText: 'Batal'
    });
    return result.isConfirmed; 
  },

  toast: (title: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
    return Toast.fire({
      icon: icon,
      title: title
    });
  }
};