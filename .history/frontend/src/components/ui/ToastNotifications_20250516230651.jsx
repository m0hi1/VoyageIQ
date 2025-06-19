import React from 'react';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TOAST_AUTO_CLOSE_MS } from '../../config/constants';

// Default toast options
const defaultOptions = {
  position: 'top-right',
  autoClose: TOAST_AUTO_CLOSE_MS,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

/**
 * Toast notification service
 */
export const notify = {
  /**
   * Show success notification
   * @param {string} message - Message to display
   * @param {Object} options - Toast options
   */
  success: (message, options = {}) => {
    toast.success(message, { ...defaultOptions, ...options });
  },

  /**
   * Show error notification
   * @param {string} message - Message to display
   * @param {Object} options - Toast options
   */
  error: (message, options = {}) => {
    toast.error(message, { ...defaultOptions, ...options });
  },

  /**
   * Show warning notification
   * @param {string} message - Message to display
   * @param {Object} options - Toast options
   */
  warning: (message, options = {}) => {
    toast.warning(message, { ...defaultOptions, ...options });
  },

  /**
   * Show info notification
   * @param {string} message - Message to display
   * @param {Object} options - Toast options
   */
  info: (message, options = {}) => {
    toast.info(message, { ...defaultOptions, ...options });
  },

  /**
   * Show a loading toast
   * @param {string} message - Message to display
   * @param {Object} options - Toast options
   * @returns {string|number} - Toast ID for updating later
   */
  loading: (message = 'Loading...', options = {}) => {
    return toast.loading(message, {
      ...defaultOptions,
      autoClose: false,
      ...options,
    });
  },

  /**
   * Update an existing toast
   * @param {string|number} id - ID of toast to update
   * @param {Object} options - New toast options
   */
  update: (id, options = {}) => {
    toast.update(id, {
      ...options,
      render: options.render || '',
      type: options.type || 'default',
      isLoading: false,
    });
  },

  /**
   * Dismiss a specific toast
   * @param {string|number} id - ID of toast to dismiss
   */
  dismiss: (id) => {
    toast.dismiss(id);
  },

  /**
   * Dismiss all toasts
   */
  dismissAll: () => {
    toast.dismiss();
  },
};

/**
 * Toast Container component to be included in App.jsx
 * Provides the container for all toast notifications
 */
const ToastNotifications = ({ position = 'top-right' }) => {
  return (
    <ToastContainer
      position={position}
      autoClose={TOAST_AUTO_CLOSE_MS}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

ToastNotifications.propTypes = {
  position: PropTypes.oneOf([
    'top-right',
    'top-center',
    'top-left',
    'bottom-right',
    'bottom-center',
    'bottom-left',
  ]),
};

export default ToastNotifications;
